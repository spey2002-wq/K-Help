package com.khelp.job.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A foreigner-friendly job listing. Listings stay PENDING until an admin approves
 * them, keeping the board trustworthy.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_listings", indexes = {
        @Index(name = "idx_jobs_status", columnList = "status"),
        @Index(name = "idx_jobs_location", columnList = "location"),
        @Index(name = "idx_jobs_type", columnList = "job_type")
})
public class JobListing extends BaseEntity {

    @Column(nullable = false, length = 250)
    private String title;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 20)
    private JobType jobType;

    @Column(length = 100)
    private String location;

    @Column(name = "visa_sponsorship", nullable = false)
    @Builder.Default
    private boolean visaSponsorship = false;

    /** True when the employer accepts applicants who do not speak Korean. */
    @Column(name = "korean_required", nullable = false)
    @Builder.Default
    private boolean koreanRequired = true;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "salary_currency", length = 10)
    @Builder.Default
    private String salaryCurrency = "KRW";

    /** Unit the salary range is quoted in (hourly wage, monthly salary, ...). */
    @Enumerated(EnumType.STRING)
    @Column(name = "salary_period", length = 10)
    private SalaryPeriod salaryPeriod;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private JobShift shift;

    @Column(name = "hours_per_week")
    private Integer hoursPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 20)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private JobCategory category;

    /** Comma separated day codes (MON,TUE,...). Null means "days are flexible". */
    @Column(name = "work_days", length = 40)
    private String workDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_period", length = 20)
    private WorkPeriod workPeriod;

    @Column(name = "meals_provided", nullable = false)
    @Builder.Default
    private boolean mealsProvided = false;

    @Column(name = "housing_provided", nullable = false)
    @Builder.Default
    private boolean housingProvided = false;

    @Column(name = "insurance_provided", nullable = false)
    @Builder.Default
    private boolean insuranceProvided = false;

    @Column(name = "transport_provided", nullable = false)
    @Builder.Default
    private boolean transportProvided = false;

    /** Employer needs someone quickly ("hiring now"). */
    @Column(nullable = false)
    @Builder.Default
    private boolean urgent = false;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "deadline")
    private LocalDate deadline;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ListingStatus status = ListingStatus.PENDING;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private long viewCount = 0L;

    @OneToMany(mappedBy = "jobListing", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JobApplication> applications = new ArrayList<>();
}
