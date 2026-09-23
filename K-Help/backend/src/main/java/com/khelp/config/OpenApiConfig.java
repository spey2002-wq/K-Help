package com.khelp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger definition with a bearer-token security scheme so the Swagger
 * UI can call protected endpoints directly.
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI khelpOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("K-Help API")
                        .description("""
                                Korea Life Platform for Foreign Residents.

                                Modules: auth, community, info, jobs, housing, chat, AI and admin.
                                Authenticate via POST /api/auth/login, then click Authorize and
                                paste the returned access token.
                                """)
                        .version("v0.1.0")
                        .contact(new Contact().name("NP Coders").email("team@khelp.app"))
                        .license(new License().name("MIT")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME,
                        new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
