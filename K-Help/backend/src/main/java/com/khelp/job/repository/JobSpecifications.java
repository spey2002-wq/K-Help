package com.khelp.job.repository;

import com.khelp.job.dto.JobSearchCriteria;
import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.ListingStatus;
import com.khelp.job.service.WorkDays;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

/**
 * Builds the job board query from {@link JobSearchCriteria}. Each filter adds
 * a predicate only when it was supplied, so one query serves the whole filter UI.
 */
public final class JobSpecifications {

    /** Keeps a pathological search box value from becoming dozens of predicates. */
    private static final int MAX_QUERY_TERMS = 6;

    private JobSpecifications() {
    }

    public static Specification<JobListing> matching(JobSearchCriteria c) {
        return (root, query, cb) -> {
            List<Predicate> all = new ArrayList<>();

            all.add(cb.equal(root.get("status"), ListingStatus.APPROVED));

            // Every word must match somewhere; "cafe hongdae" finds a Hongdae cafe job.
            for (String term : searchTerms(c.query())) {
                String pattern = "%" + escapeLike(term) + "%";
                all.add(cb.or(
                        like(cb, root.get("title"), pattern),
                        like(cb, root.get("company"), pattern),
                        like(cb, root.get("location"), pattern),
                        like(cb, root.get("description"), pattern),
                        like(cb, root.get("requirements"), pattern)));
            }

            if (!CollectionUtils.isEmpty(c.jobTypes())) {
                all.add(root.get("jobType").in(c.jobTypes()));
            }
            if (StringUtils.hasText(c.location())) {
                all.add(like(cb, root.get("location"), "%" + escapeLike(c.location().trim()) + "%"));
            }
            if (c.visaSponsorship() != null) {
                all.add(cb.equal(root.get("visaSponsorship"), c.visaSponsorship()));
            }
            if (c.koreanRequired() != null) {
                all.add(cb.equal(root.get("koreanRequired"), c.koreanRequired()));
            }

            // A listing with no pay stated is kept so salary filters don't hide it.
            if (c.minSalary() != null) {
                all.add(cb.or(cb.isNull(root.get("salaryMax")),
                        cb.greaterThanOrEqualTo(root.<BigDecimal>get("salaryMax"), c.minSalary())));
            }
            if (c.maxSalary() != null) {
                all.add(cb.or(cb.isNull(root.get("salaryMin")),
                        cb.lessThanOrEqualTo(root.<BigDecimal>get("salaryMin"), c.maxSalary())));
            }
            if (c.salaryPeriod() != null) {
                all.add(cb.equal(root.get("salaryPeriod"), c.salaryPeriod()));
            }

            if (c.shift() != null) {
                all.add(cb.equal(root.get("shift"), c.shift()));
            }
            if (c.experienceLevel() != null) {
                all.add(cb.equal(root.get("experienceLevel"), c.experienceLevel()));
            }
            if (c.maxHoursPerWeek() != null) {
                all.add(cb.or(cb.isNull(root.get("hoursPerWeek")),
                        cb.lessThanOrEqualTo(root.<Integer>get("hoursPerWeek"), c.maxHoursPerWeek())));
            }
            if (c.postedWithinDays() != null && c.postedWithinDays() > 0) {
                Instant after = Instant.now().minus(c.postedWithinDays(), ChronoUnit.DAYS);
                all.add(cb.greaterThanOrEqualTo(root.<Instant>get("createdAt"), after));
            }

            if (!CollectionUtils.isEmpty(c.categories())) {
                all.add(root.get("category").in(c.categories()));
            }
            if (!CollectionUtils.isEmpty(c.workPeriods())) {
                all.add(root.get("workPeriod").in(c.workPeriods()));
            }

            // "I can work these days": drop jobs that need a day the seeker excluded.
            if (!CollectionUtils.isEmpty(c.availableDays())) {
                List<String> available = c.availableDays().stream()
                        .map(day -> day == null ? "" : day.trim().toUpperCase(Locale.ROOT))
                        .toList();
                Expression<String> days = root.get("workDays");
                List<Predicate> needsOtherDay = new ArrayList<>();
                for (String day : WorkDays.ALL) {
                    if (!available.contains(day)) {
                        needsOtherDay.add(cb.like(days, "%" + day + "%"));
                    }
                }
                if (!needsOtherDay.isEmpty()) {
                    all.add(cb.or(cb.isNull(days), cb.not(cb.or(needsOtherDay.toArray(new Predicate[0])))));
                }
            }

            requireTrue(all, cb, root.get("mealsProvided"), c.mealsProvided());
            requireTrue(all, cb, root.get("housingProvided"), c.housingProvided());
            requireTrue(all, cb, root.get("insuranceProvided"), c.insuranceProvided());
            requireTrue(all, cb, root.get("transportProvided"), c.transportProvided());
            requireTrue(all, cb, root.get("urgent"), c.urgent());

            return cb.and(all.toArray(new Predicate[0]));
        };
    }

    private static void requireTrue(
            List<Predicate> all,
            CriteriaBuilder cb,
            Path<Object> path,
            Boolean wanted) {
        if (Boolean.TRUE.equals(wanted)) {
            all.add(cb.isTrue(path.as(Boolean.class)));
        }
    }

    private static Predicate like(
            CriteriaBuilder cb, Expression<String> field, String pattern) {
        return cb.like(cb.lower(field), pattern.toLowerCase(Locale.ROOT), '\\');
    }

    static List<String> searchTerms(String raw) {
        if (!StringUtils.hasText(raw)) {
            return List.of();
        }
        return Arrays.stream(raw.trim().split("\\s+"))
                .limit(MAX_QUERY_TERMS)
                .toList();
    }

    /** Escapes LIKE wildcards so a typed "%" or "_" is searched literally. */
    static String escapeLike(String value) {
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
