package com.khelp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Partial profile update; {@code null} fields are left unchanged.
 */
public record UpdateProfileRequest(
        @Size(max = 120) String fullName,
        @Size(max = 60) String nationality,
        @Size(max = 20) String visaType,
        @Size(max = 10) String preferredLanguage,
        @Size(max = 500) String profileImageUrl,
        @Size(max = 500) String bio,
        @Email String email
) {
}
