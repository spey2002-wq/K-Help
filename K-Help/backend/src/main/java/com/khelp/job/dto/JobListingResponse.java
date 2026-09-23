package com.khelp.job.dto;

import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.ListingStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record JobListingResponse(
        Long id,
        String title,
        String company,
        String description,
        String requirements,
        JobType jobType,
        String location,
        boolean visaSponsorship,
        boolean koreanRequired,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String salaryCurrency,
        String contactEmail,
        LocalDate deadline,
        Long postedById,
        String postedByUsername,
        ListingStatus status,
        long viewCount,
        Instant createdAt
) {

    public static JobListingResponse from(JobListing job) {
        return new JobListingResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getDescription(),
                job.getRequirements(),
                job.getJobType(),
                job.getLocation(),
                job.isVisaSponsorship(),
                job.isKoreanRequired(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency(),
                job.getContactEmail(),
                job.getDeadline(),
                job.getPostedBy().getId(),
                job.getPostedBy().getUsername(),
                job.getStatus(),
                job.getViewCount(),
                job.getCreatedAt());
    }

    /** List-view projection that omits long description text. */
    public static JobListingResponse summaryOf(JobListing job) {
        return new JobListingResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                null,
                null,
                job.getJobType(),
                job.getLocation(),
                job.isVisaSponsorship(),
                job.isKoreanRequired(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency(),
                null,
                job.getDeadline(),
                job.getPostedBy().getId(),
                job.getPostedBy().getUsername(),
                job.getStatus(),
                job.getViewCount(),
                job.getCreatedAt());
    }
}
