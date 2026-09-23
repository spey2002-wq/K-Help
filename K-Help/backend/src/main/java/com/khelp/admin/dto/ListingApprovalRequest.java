package com.khelp.admin.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Admin decision on a pending job or housing listing.
 */
public record ListingApprovalRequest(
        @NotNull(message = "Approved flag is required")
        Boolean approved,

        @Size(max = 500)
        String note
) {
}
