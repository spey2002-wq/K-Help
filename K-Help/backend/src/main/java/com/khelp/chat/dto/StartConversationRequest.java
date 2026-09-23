package com.khelp.chat.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Opens (or reuses) a one-to-one conversation with another member.
 */
public record StartConversationRequest(
        @NotNull(message = "Recipient id is required")
        Long recipientId,

        /** Optional link back to the job/housing listing that started the chat. */
        String contextType,

        Long contextId
) {
}
