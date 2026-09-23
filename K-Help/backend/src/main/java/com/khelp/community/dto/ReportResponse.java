package com.khelp.community.dto;

import com.khelp.community.entity.Report;
import com.khelp.community.entity.ReportStatus;
import com.khelp.community.entity.ReportTargetType;
import java.time.Instant;

public record ReportResponse(
        Long id,
        ReportTargetType targetType,
        Long targetId,
        String reason,
        String details,
        Long reporterId,
        String reporterUsername,
        ReportStatus status,
        String resolutionNote,
        Instant createdAt
) {

    public static ReportResponse from(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getTargetType(),
                report.getTargetId(),
                report.getReason(),
                report.getDetails(),
                report.getReporter().getId(),
                report.getReporter().getUsername(),
                report.getStatus(),
                report.getResolutionNote(),
                report.getCreatedAt());
    }
}
