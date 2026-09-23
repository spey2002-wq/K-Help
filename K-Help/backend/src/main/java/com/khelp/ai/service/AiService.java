package com.khelp.ai.service;

import com.khelp.ai.client.LlmClient;
import com.khelp.ai.config.AiProperties;
import com.khelp.ai.dto.AiResponse;
import com.khelp.ai.dto.PoliteMessageRequest;
import com.khelp.ai.dto.SummarizeRequest;
import com.khelp.ai.dto.TranslationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * AI middleware: prompt engineering for translation, summarization and polite
 * message generation.
 *
 * <p>When no API key is configured the service falls back to deterministic mock
 * output so the whole stack stays demoable offline.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final LlmClient llmClient;
    private final AiProperties properties;

    private static final String TRANSLATOR_SYSTEM = """
            You are a professional translator for foreign residents living in South Korea.
            Translate the user's text faithfully into the requested target language.
            Preserve names, numbers, addresses and official terminology exactly.
            Return only the translation, with no explanations or extra commentary.
            """;

    private static final String SUMMARIZER_SYSTEM = """
            You are an assistant that explains Korean official documents to foreign residents.
            Summarize the user's text clearly and neutrally in the requested output language.
            Structure the answer as:
            1. A one-sentence overview.
            2. Key points as short bullet lines.
            3. Any deadlines, fees or required actions, if present.
            Never invent information that is not in the source text.
            """;

    private static final String POLITE_SYSTEM = """
            You are a Korean language assistant helping foreign residents write polite messages.
            Rewrite the user's message in natural, respectful Korean appropriate to the recipient
            and the requested formality level.
            Return the Korean message first, then an English back-translation on a new line
            prefixed with "EN: ".
            """;

    public AiResponse translate(TranslationRequest request) {
        String source = StringUtils.hasText(request.sourceLanguage())
                ? request.sourceLanguage() : "auto";
        String target = request.targetLanguage();

        if (!properties.isConfigured()) {
            return AiResponse.mock(
                    "[mock translation to " + target + "] " + request.text(),
                    source,
                    target);
        }

        String userPrompt = """
                Source language: %s
                Target language: %s

                Text:
                %s
                """.formatted(source, target, request.text());

        String result = llmClient.complete(TRANSLATOR_SYSTEM, userPrompt);
        return AiResponse.of(result, source, target, properties.getModel());
    }

    public AiResponse summarize(SummarizeRequest request) {
        String outputLanguage = StringUtils.hasText(request.outputLanguage())
                ? request.outputLanguage() : "en";

        if (!properties.isConfigured()) {
            String preview = request.text().length() > 300
                    ? request.text().substring(0, 300) + "..."
                    : request.text();
            return AiResponse.mock(
                    "[mock summary in " + outputLanguage + "] " + preview,
                    "auto",
                    outputLanguage);
        }

        String userPrompt = """
                Output language: %s

                Document:
                %s
                """.formatted(outputLanguage, request.text());

        String result = llmClient.complete(SUMMARIZER_SYSTEM, userPrompt);
        return AiResponse.of(result, "auto", outputLanguage, properties.getModel());
    }

    public AiResponse generatePoliteMessage(PoliteMessageRequest request) {
        String recipient = StringUtils.hasText(request.recipientType())
                ? request.recipientType() : "general acquaintance";
        String formality = StringUtils.hasText(request.formality())
                ? request.formality() : "polite";

        if (!properties.isConfigured()) {
            return AiResponse.mock(
                    "[mock polite Korean, %s to %s] 안녕하세요. %s"
                            .formatted(formality, recipient, request.text()),
                    "en",
                    "ko");
        }

        String userPrompt = """
                Recipient type: %s
                Formality level: %s

                Message to rewrite:
                %s
                """.formatted(recipient, formality, request.text());

        String result = llmClient.complete(POLITE_SYSTEM, userPrompt);
        return AiResponse.of(result, "en", "ko", properties.getModel());
    }
}
