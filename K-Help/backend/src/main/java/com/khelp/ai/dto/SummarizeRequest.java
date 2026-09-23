package com.khelp.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request for summarizing a long Korean document or official notice.
 */
public record SummarizeRequest(
        @NotBlank(message = "Text is required")
        @Size(max = 20000, message = "Text must be at most 20000 characters")
        String text,

        /** Language the summary should be written in. */
        @Size(max = 10)
        String outputLanguage
) {
}
