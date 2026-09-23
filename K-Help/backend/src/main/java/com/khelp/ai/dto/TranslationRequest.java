package com.khelp.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request for translating text between languages.
 */
public record TranslationRequest(
        @NotBlank(message = "Text is required")
        @Size(max = 5000, message = "Text must be at most 5000 characters")
        String text,

        @Size(max = 10)
        String sourceLanguage,

        @NotBlank(message = "Target language is required")
        @Size(max = 10)
        String targetLanguage
) {
}
