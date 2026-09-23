package com.khelp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for the K-Help backend.
 *
 * <p>K-Help is a Korea life platform for foreign residents, bundling community,
 * living guides, jobs, housing, real-time chat, and AI-assisted translation.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class KHelpApplication {

    public static void main(String[] args) {
        SpringApplication.run(KHelpApplication.class, args);
    }
}
