package com.khelp.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request for turning a rough message into polite Korean.
 */
public record PoliteMessageRequest(
        @NotBlank(message = "Text is required")
        @Size(max = 2000, message = "Text must be at most 2000 characters")
        String text,

        /** Relationship with the recipient: employer, landlord, clinic, etc. */
        @Size(max = 50)
        String recipientType,

        /** Formality level: casual, polite or formal. */
        @Size(max = 20)
        String formality
) {
}
