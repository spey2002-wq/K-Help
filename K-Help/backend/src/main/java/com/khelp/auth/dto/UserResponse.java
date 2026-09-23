package com.khelp.auth.dto;

import com.khelp.auth.entity.User;
import java.time.Instant;

/**
 * Public projection of a {@link User}; never exposes the password hash.
 */
public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String nationality,
        String visaType,
        String preferredLanguage,
        String profileImageUrl,
        String bio,
        String role,
        boolean enabled,
        boolean suspended,
        Instant createdAt,
        Instant lastLoginAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getNationality(),
                user.getVisaType(),
                user.getPreferredLanguage(),
                user.getProfileImageUrl(),
                user.getBio(),
                user.getRole().name(),
                user.isEnabled(),
                user.isSuspended(),
                user.getCreatedAt(),
                user.getLastLoginAt());
    }
}
