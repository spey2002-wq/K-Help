package com.khelp.job.dto;

import com.khelp.job.entity.ExperienceLevel;
import com.khelp.job.entity.JobCategory;
import com.khelp.job.entity.JobShift;
import com.khelp.job.entity.JobSort;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.SalaryPeriod;
import com.khelp.job.entity.WorkPeriod;
import java.math.BigDecimal;
import java.util.List;

/**
 * Optional filters for the job board search. A {@code null} (or empty list)
 * means "do not filter on this".
 *
 * @param query            words that must each appear in the title, company, location, description or requirements
 * @param jobTypes         accepted employment types (any of)
 * @param categories       accepted kinds of work (any of)
 * @param workPeriods      accepted contract lengths (any of)
 * @param availableDays    days the seeker can work; jobs needing any other day are excluded,
 *                         jobs without a fixed schedule always match
 * @param minSalary        lowest acceptable pay; listings paying less are excluded
 * @param maxSalary        highest pay the seeker cares about; listings starting above are excluded
 * @param salaryPeriod     only compare listings quoted per hour / month / year
 * @param maxHoursPerWeek  listings requiring more hours than this are excluded
 * @param postedWithinDays only listings created in the last N days
 * @param mealsProvided    when true, only listings that include meals (same for the other perks)
 * @param urgent           when true, only "hiring now" listings
 * @param sort             result ordering, newest first by default
 */
public record JobSearchCriteria(
        String query,
        List<JobType> jobTypes,
        String location,
        Boolean visaSponsorship,
        Boolean koreanRequired,
        BigDecimal minSalary,
        BigDecimal maxSalary,
        SalaryPeriod salaryPeriod,
        JobShift shift,
        Integer maxHoursPerWeek,
        ExperienceLevel experienceLevel,
        Integer postedWithinDays,
        List<JobCategory> categories,
        List<WorkPeriod> workPeriods,
        List<String> availableDays,
        Boolean mealsProvided,
        Boolean housingProvided,
        Boolean insuranceProvided,
        Boolean transportProvided,
        Boolean urgent,
        JobSort sort
) {
}
