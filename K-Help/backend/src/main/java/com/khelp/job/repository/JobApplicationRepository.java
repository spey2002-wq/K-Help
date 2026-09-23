package com.khelp.job.repository;

import com.khelp.job.entity.ApplicationStatus;
import com.khelp.job.entity.JobApplication;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<JobApplication> findByJobListingIdOrderByCreatedAtDesc(Long jobListingId);

    Optional<JobApplication> findByJobListingIdAndApplicantId(Long jobListingId, Long applicantId);

    boolean existsByJobListingIdAndApplicantId(Long jobListingId, Long applicantId);

    long countByStatus(ApplicationStatus status);
}
