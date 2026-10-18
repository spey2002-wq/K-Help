package com.khelp.job.dto;

import com.khelp.job.entity.ExperienceLevel;
import com.khelp.job.entity.JobCategory;
import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.JobShift;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.SalaryPeriod;
import com.khelp.job.entity.ListingStatus;
import com.khelp.job.entity.WorkPeriod;
import com.khelp.job.service.WorkDays;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

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
        SalaryPeriod salaryPeriod,
        JobShift shift,
        Integer hoursPerWeek,
        ExperienceLevel experienceLevel,
        JobCategory category,
        List<String> workDays,
        WorkPeriod workPeriod,
        boolean mealsProvided,
        boolean housingProvided,
        boolean insuranceProvided,
        boolean transportProvided,
        boolean urgent,
        String contactEmail,
        LocalDate deadline,
        Long postedById,
        String postedByUsername,
        ListingStatus status,
        long viewCount,
        Instant createdAt
) {

    public static JobListingResponse from(JobListing job) {
        return build(job, job.getDescription(), job.getRequirements(), job.getContactEmail());
    }

    /** List-view projection that omits long description text. */
    public static JobListingResponse summaryOf(JobListing job) {
        return build(job, null, null, null);
    }

    private static JobListingResponse build(
            JobListing job, String description, String requirements, String contactEmail) {
        return new JobListingResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                description,
                requirements,
                job.getJobType(),
                job.getLocation(),
                job.isVisaSponsorship(),
                job.isKoreanRequired(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSalaryCurrency(),
                job.getSalaryPeriod(),
                job.getShift(),
                job.getHoursPerWeek(),
                job.getExperienceLevel(),
                job.getCategory(),
                WorkDays.fromStorage(job.getWorkDays()),
                job.getWorkPeriod(),
                job.isMealsProvided(),
                job.isHousingProvided(),
                job.isInsuranceProvided(),
                job.isTransportProvided(),
                job.isUrgent(),
                contactEmail,
                job.getDeadline(),
                job.getPostedBy().getId(),
                job.getPostedBy().getUsername(),
                job.getStatus(),
                job.getViewCount(),
                job.getCreatedAt());
    }
}
