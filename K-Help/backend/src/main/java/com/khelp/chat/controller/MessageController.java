package com.khelp.chat.controller;

import com.khelp.chat.dto.ChatMessageResponse;
import com.khelp.chat.dto.SendMessageRequest;
import com.khelp.chat.service.ChatService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * STOMP message controller for real-time chat.
 *
 * <p>Clients publish to {@code /app/chat/{conversationId}/send}. The message is
 * persisted by {@link ChatService} and broadcast to
 * {@code /topic/conversations/{conversationId}}.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{conversationId}/send")
    public void handleIncomingMessage(
            @DestinationVariable Long conversationId,
            @Payload SendMessageRequest request,
            Principal principal) {

        if (principal == null) {
            log.warn("Rejected STOMP message on conversation {}: unauthenticated", conversationId);
            return;
        }

        try {
            ChatMessageResponse saved = chatService.sendMessage(conversationId, request);
            // ChatService also broadcasts; this keeps the contract explicit for STOMP clients.
            log.debug("Handled STOMP message {} for conversation {} from {}",
                    saved.id(), conversationId, principal.getName());
        } catch (Exception ex) {
            log.warn("Failed to handle STOMP message for conversation {}: {}",
                    conversationId, ex.getMessage());
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    "Message could not be delivered: " + ex.getMessage());
        }
    }

    @MessageMapping("/chat/{conversationId}/read")
    public void handleReadReceipt(
            @DestinationVariable Long conversationId,
            Principal principal) {
        if (principal == null) {
            return;
        }
        try {
            chatService.markRead(conversationId);
        } catch (Exception ex) {
            log.warn("Failed to mark conversation {} read: {}", conversationId, ex.getMessage());
        }
    }
}
