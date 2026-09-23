package com.khelp.ai.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client used by the AI middleware to reach the external LLM provider.
 *
 * <p>The backend acts as a proxy so API keys never reach the browser.
 */
@Configuration
public class AiConfig {

    @Bean
    public RestTemplate aiRestTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(60))
                .build();
    }
}
