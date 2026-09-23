package com.khelp.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.khelp.ai.config.AiProperties;
import com.khelp.common.exception.ApiException;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Thin client for an OpenAI-compatible chat completions API.
 *
 * <p>All prompt construction lives in the service layer; this class only handles
 * transport, authentication and response extraction.
 */
@Slf4j
@Component
public class LlmClient {

    private final AiProperties properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LlmClient(AiProperties properties, RestTemplate aiRestTemplate, ObjectMapper objectMapper) {
        this.properties = properties;
        this.restTemplate = aiRestTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Sends a system + user prompt pair and returns the assistant's text.
     *
     * @throws ApiException when the provider is unreachable or returns an error
     */
    public String complete(String systemPrompt, String userPrompt) {
        if (!properties.isConfigured()) {
            throw new ApiException(
                    "AI provider is not configured. Set AI_API_KEY or enable app.ai.mock-mode.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }

        Map<String, Object> payload = Map.of(
                "model", properties.getModel(),
                "temperature", properties.getTemperature(),
                "max_tokens", properties.getMaxTokens(),
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(properties.getApiKey());

        try {
            String raw = restTemplate.postForObject(
                    properties.getBaseUrl() + "/chat/completions",
                    new HttpEntity<>(payload, headers),
                    String.class);

            return extractContent(raw);
        } catch (RestClientException ex) {
            log.error("LLM request failed: {}", ex.getMessage());
            throw new ApiException("AI provider request failed: " + ex.getMessage(),
                    HttpStatus.BAD_GATEWAY);
        }
    }

    private String extractContent(String raw) {
        try {
            JsonNode root = objectMapper.readTree(raw);
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isMissingNode() || content.isNull()) {
                throw new ApiException("AI provider returned an unexpected response",
                        HttpStatus.BAD_GATEWAY);
            }
            return content.asText().trim();
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException("Could not parse AI provider response",
                    HttpStatus.BAD_GATEWAY);
        }
    }
}
