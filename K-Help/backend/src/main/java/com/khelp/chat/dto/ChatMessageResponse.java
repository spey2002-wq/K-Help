package com.khelp.chat.dto;

import com.khelp.chat.entity.ChatMessage;
import java.time.Instant;

public record ChatMessageResponse(
        Long id,
        Long conversationId,
        Long senderId,
        String senderUsername,
        String content,
        String translatedContent,
        String sourceLanguage,
        String targetLanguage,
        Instant readAt,
        Instant createdAt
) {

    public static ChatMessageResponse from(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getConversation().getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getContent(),
                message.getTranslatedContent(),
                message.getSourceLanguage(),
                message.getTargetLanguage(),
                message.getReadAt(),
                message.getCreatedAt());
    }
}
