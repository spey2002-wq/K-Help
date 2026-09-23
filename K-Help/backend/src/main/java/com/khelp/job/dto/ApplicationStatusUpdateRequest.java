package com.khelp.job.dto;

import com.khelp.job.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Employer/admin update of an application's status.
 */
public record ApplicationStatusUpdateRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status,

        @Size(max = 500)
        String employerNote
) {
}
