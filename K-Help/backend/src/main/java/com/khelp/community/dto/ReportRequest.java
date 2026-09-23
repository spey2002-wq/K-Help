package com.khelp.community.dto;

import com.khelp.community.entity.ReportTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportRequest(
        @NotNull(message = "Target type is required")
        ReportTargetType targetType,

        @NotNull(message = "Target id is required")
        Long targetId,

        @NotBlank(message = "Reason is required")
        @Size(max = 500, message = "Reason must be at most 500 characters")
        String reason,

        String details
) {
}
