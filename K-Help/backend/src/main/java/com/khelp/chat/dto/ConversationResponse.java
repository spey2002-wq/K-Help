package com.khelp.chat.dto;

import com.khelp.chat.entity.Conversation;
import java.time.Instant;

public record ConversationResponse(
        Long id,
        Long otherParticipantId,
        String otherParticipantUsername,
        String otherParticipantFullName,
        String otherParticipantProfileImageUrl,
        String lastMessagePreview,
        Instant lastMessageAt,
        long unreadCount,
        String contextType,
        Long contextId,
        Instant createdAt
) {

    public static ConversationResponse from(Conversation conversation, Long currentUserId) {
        var other = conversation.otherParticipant(currentUserId);
        boolean isParticipantOne = conversation.getParticipantOne().getId().equals(currentUserId);

        return new ConversationResponse(
                conversation.getId(),
                other.getId(),
                other.getUsername(),
                other.getFullName(),
                other.getProfileImageUrl(),
                conversation.getLastMessagePreview(),
                conversation.getLastMessageAt(),
                isParticipantOne ? conversation.getUnreadCountOne() : conversation.getUnreadCountTwo(),
                conversation.getContextType(),
                conversation.getContextId(),
                conversation.getCreatedAt());
    }
}
