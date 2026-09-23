package com.khelp.job.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A member's application to a {@link JobListing}, with status tracking.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_applications", uniqueConstraints = {
        @UniqueConstraint(name = "uk_job_application_listing_user",
                columnNames = {"job_listing_id", "applicant_id"})
})
public class JobApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_listing_id", nullable = false)
    private JobListing jobListing;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "employer_note", length = 500)
    private String employerNote;
}
