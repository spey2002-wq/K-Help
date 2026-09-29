package com.khelp.job.dto;

import com.khelp.job.entity.ExperienceLevel;
import com.khelp.job.entity.JobShift;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.SalaryPeriod;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record JobListingRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 250)
        String title,

        @NotBlank(message = "Company is required")
        @Size(max = 150)
        String company,

        @NotBlank(message = "Description is required")
        String description,

        String requirements,

        @NotNull(message = "Job type is required")
        JobType jobType,

        @Size(max = 100)
        String location,

        Boolean visaSponsorship,

        Boolean koreanRequired,

        BigDecimal salaryMin,

        BigDecimal salaryMax,

        @Size(max = 10)
        String salaryCurrency,

        SalaryPeriod salaryPeriod,

        JobShift shift,

        @Min(value = 1, message = "Hours per week must be at least 1")
        @Max(value = 80, message = "Hours per week cannot exceed 80")
        Integer hoursPerWeek,

        ExperienceLevel experienceLevel,

        @Size(max = 150)
        String contactEmail,

        LocalDate deadline
) {
}
