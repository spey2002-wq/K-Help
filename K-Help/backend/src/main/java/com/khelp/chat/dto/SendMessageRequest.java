package com.khelp.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Inbound chat payload for both the REST and STOMP WebSocket paths.
 */
public record SendMessageRequest(
        @NotBlank(message = "Message content is required")
        @Size(max = 4000, message = "Message must be at most 4000 characters")
        String content,

        /** When set, the AI middleware translates the message on send. */
        String targetLanguage
) {
}
