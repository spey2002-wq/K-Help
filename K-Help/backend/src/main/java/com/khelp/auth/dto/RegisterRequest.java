package com.khelp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
        String password,

        @Size(max = 120)
        String fullName,

        @Size(max = 60)
        String nationality,

        @Size(max = 20)
        String visaType,

        @Size(max = 10)
        String preferredLanguage
) {
}
