package com.khelp.admin.dto;

import jakarta.validation.constraints.Size;

/**
 * Admin moderation actions on a member account.
 */
public record UserModerationRequest(
        Boolean enabled,
        Boolean suspended,
        /** Optional role change: USER, MODERATOR or ADMIN. */
        String role,
        @Size(max = 500)
        String reason
) {
}
