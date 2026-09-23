package com.khelp.chat.service;

import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.chat.dto.ChatMessageResponse;
import com.khelp.chat.dto.ConversationResponse;
import com.khelp.chat.dto.SendMessageRequest;
import com.khelp.chat.dto.StartConversationRequest;
import com.khelp.chat.entity.ChatMessage;
import com.khelp.chat.entity.Conversation;
import com.khelp.chat.repository.ChatMessageRepository;
import com.khelp.chat.repository.ConversationRepository;
import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.security.SecurityUtils;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Real-time chat: conversation management, message history and read receipts.
 *
 * <p>Persisted messages are pushed to subscribers of
 * {@code /topic/conversations/{id}} through {@link SimpMessagingTemplate}, so both
 * REST callers and STOMP clients receive the same event stream.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ConversationResponse startConversation(StartConversationRequest request) {
        User current = requireCurrentUser();
        User recipient = userRepository.findById(request.recipientId())
                .orElseThrow(() -> ApiException.notFound("Recipient"));

        if (current.getId().equals(recipient.getId())) {
            throw ApiException.badRequest("You cannot start a conversation with yourself");
        }

        Conversation conversation = conversationRepository
                .findBetween(current.getId(), recipient.getId())
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .participantOne(current)
                        .participantTwo(recipient)
                        .contextType(request.contextType())
                        .contextId(request.contextId())
                        .build()));

        return ConversationResponse.from(conversation, current.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<ConversationResponse> listConversations(int page, int size) {
        User current = requireCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        Page<Conversation> conversations =
                conversationRepository.findAllForUser(current.getId(), pageable);

        return PageResponse.from(
                conversations.map(conversation -> ConversationResponse.from(conversation, current.getId())));
    }

    @Transactional(readOnly = true)
    public PageResponse<ChatMessageResponse> listMessages(Long conversationId, int page, int size) {
        User current = requireCurrentUser();
        Conversation conversation = requireConversation(conversationId, current.getId());

        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages =
                chatMessageRepository.findByConversationIdOrderByCreatedAtDesc(conversation.getId(), pageable);

        return PageResponse.from(messages.map(ChatMessageResponse::from));
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long conversationId, SendMessageRequest request) {
        User sender = requireCurrentUser();
        Conversation conversation = requireConversation(conversationId, sender.getId());

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.content())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        updateConversationSummary(conversation, sender, saved);

        ChatMessageResponse response = ChatMessageResponse.from(saved);
        broadcast(conversation.getId(), response);

        return response;
    }

    @Transactional
    public int markRead(Long conversationId) {
        User reader = requireCurrentUser();
        Conversation conversation = requireConversation(conversationId, reader.getId());

        int updated = chatMessageRepository.markConversationRead(conversationId, reader.getId());

        if (conversation.getParticipantOne().getId().equals(reader.getId())) {
            conversation.setUnreadCountOne(0L);
        } else {
            conversation.setUnreadCountTwo(0L);
        }
        conversationRepository.save(conversation);

        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId + "/read",
                new ReadReceipt(conversationId, reader.getId(), Instant.now()));

        return updated;
    }

    // -------------------------------------------------------------- helpers

    private void updateConversationSummary(Conversation conversation, User sender, ChatMessage message) {
        String preview = message.getContent().length() > 200
                ? message.getContent().substring(0, 200)
                : message.getContent();

        conversation.setLastMessagePreview(preview);
        conversation.setLastMessageAt(message.getCreatedAt() != null ? message.getCreatedAt() : Instant.now());

        boolean senderIsParticipantOne =
                conversation.getParticipantOne().getId().equals(sender.getId());

        if (senderIsParticipantOne) {
            conversation.setUnreadCountTwo(conversation.getUnreadCountTwo() + 1);
        } else {
            conversation.setUnreadCountOne(conversation.getUnreadCountOne() + 1);
        }

        conversationRepository.save(conversation);
    }

    private void broadcast(Long conversationId, ChatMessageResponse message) {
        try {
            messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, message);
        } catch (Exception ex) {
            // A broker hiccup must never fail the persisted write.
            log.warn("Failed to broadcast message for conversation {}: {}",
                    conversationId, ex.getMessage());
        }
    }

    private Conversation requireConversation(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> ApiException.notFound("Conversation"));

        if (!conversation.includes(userId)) {
            throw ApiException.forbidden("You are not a participant in this conversation");
        }
        return conversation;
    }

    private User requireCurrentUser() {
        String username = SecurityUtils.currentUsername();
        if (!StringUtils.hasText(username)) {
            throw ApiException.forbidden("Authentication required");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User"));
    }

    /** Payload pushed when the other participant reads the conversation. */
    public record ReadReceipt(Long conversationId, Long readerId, Instant readAt) {
    }
}
