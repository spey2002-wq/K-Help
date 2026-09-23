package com.khelp.ai.dto;

import java.time.Instant;

/**
 * Normalized AI response returned by every AI endpoint.
 */
public record AiResponse(
        String result,
        String sourceLanguage,
        String targetLanguage,
        String model,
        boolean mock,
        Instant generatedAt
) {

    public static AiResponse of(
            String result, String sourceLanguage, String targetLanguage, String model) {
        return new AiResponse(result, sourceLanguage, targetLanguage, model, false, Instant.now());
    }

    public static AiResponse mock(String result, String sourceLanguage, String targetLanguage) {
        return new AiResponse(result, sourceLanguage, targetLanguage, "mock", true, Instant.now());
    }
}
