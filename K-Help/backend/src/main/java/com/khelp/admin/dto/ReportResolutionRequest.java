package com.khelp.admin.dto;

import com.khelp.community.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Admin resolution of a user-submitted report.
 */
public record ReportResolutionRequest(
        @NotNull(message = "Status is required")
        ReportStatus status,

        @Size(max = 500)
        String resolutionNote
) {
}
