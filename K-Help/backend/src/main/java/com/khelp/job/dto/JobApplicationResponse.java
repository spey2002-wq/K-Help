package com.khelp.job.dto;

import com.khelp.job.entity.ApplicationStatus;
import com.khelp.job.entity.JobApplication;
import java.time.Instant;

public record JobApplicationResponse(
        Long id,
        Long jobListingId,
        String jobTitle,
        String company,
        Long applicantId,
        String applicantUsername,
        String coverLetter,
        String resumeUrl,
        ApplicationStatus status,
        String employerNote,
        Instant createdAt,
        Instant updatedAt
) {

    public static JobApplicationResponse from(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getJobListing().getId(),
                application.getJobListing().getTitle(),
                application.getJobListing().getCompany(),
                application.getApplicant().getId(),
                application.getApplicant().getUsername(),
                application.getCoverLetter(),
                application.getResumeUrl(),
                application.getStatus(),
                application.getEmployerNote(),
                application.getCreatedAt(),
                application.getUpdatedAt());
    }
}
