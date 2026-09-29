package com.khelp.job.dto;

import com.khelp.job.entity.ExperienceLevel;
import com.khelp.job.entity.JobShift;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.SalaryPeriod;
import java.math.BigDecimal;

/**
 * Optional filters for the job board search. A {@code null} field means
 * "do not filter on this".
 *
 * @param minSalary       lowest acceptable pay; listings paying less are excluded
 * @param maxSalary       highest pay the seeker cares about; listings starting above are excluded
 * @param salaryPeriod    only compare listings quoted per hour / month / year
 * @param maxHoursPerWeek listings requiring more hours than this are excluded
 * @param postedWithinDays only listings created in the last N days
 */
public record JobSearchCriteria(
        String query,
        JobType jobType,
        String location,
        Boolean visaSponsorship,
        Boolean koreanRequired,
        BigDecimal minSalary,
        BigDecimal maxSalary,
        SalaryPeriod salaryPeriod,
        JobShift shift,
        Integer maxHoursPerWeek,
        ExperienceLevel experienceLevel,
        Integer postedWithinDays
) {
}
