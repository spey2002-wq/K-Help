package com.khelp.ai.controller;

import com.khelp.ai.dto.AiResponse;
import com.khelp.ai.dto.PoliteMessageRequest;
import com.khelp.ai.dto.SummarizeRequest;
import com.khelp.ai.dto.TranslationRequest;
import com.khelp.ai.service.AiService;
import com.khelp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Spring Boot proxy in front of the external LLM API.
 *
 * <p>Keeping this server-side means the provider API key is never exposed to the
 * Next.js client, and lets the platform add rate limiting and caching later.
 */
@Tag(name = "AI", description = "Translation, summarization and polite message generation")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @Operation(summary = "Translate text between languages")
    @PostMapping("/translate")
    public ResponseEntity<ApiResponse<AiResponse>> translate(
            @Valid @RequestBody TranslationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.translate(request)));
    }

    @Operation(summary = "Summarize a Korean document or official notice")
    @PostMapping("/summarize")
    public ResponseEntity<ApiResponse<AiResponse>> summarize(
            @Valid @RequestBody SummarizeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.summarize(request)));
    }

    @Operation(summary = "Generate a polite Korean message")
    @PostMapping("/polite-message")
    public ResponseEntity<ApiResponse<AiResponse>> politeMessage(
            @Valid @RequestBody PoliteMessageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.generatePoliteMessage(request)));
    }
}
