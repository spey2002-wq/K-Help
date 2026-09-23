package com.khelp.ai.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * External LLM provider settings, bound from {@code app.ai.*}.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.ai")
public class AiProperties {

    /** Provider API key. Leave blank to run in offline/mock mode. */
    private String apiKey;

    /** Base URL of an OpenAI-compatible chat completions API. */
    private String baseUrl = "https://api.openai.com/v1";

    private String model = "gpt-4o-mini";

    private double temperature = 0.3;

    private int maxTokens = 1024;

    /** When true, skip the network call and return deterministic stub text. */
    private boolean mockMode = false;

    /** Request timeout in milliseconds. */
    private long timeoutMs = 60_000;

    public boolean isConfigured() {
        return !mockMode && apiKey != null && !apiKey.isBlank();
    }
}
