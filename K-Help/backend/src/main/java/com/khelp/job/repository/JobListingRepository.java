package com.khelp.job.repository;

import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.ListingStatus;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobListingRepository extends JpaRepository<JobListing, Long> {

    Page<JobListing> findByStatus(ListingStatus status, Pageable pageable);

    Page<JobListing> findByPostedById(Long postedById, Pageable pageable);

    /**
     * Multi-criteria job search. Every filter is optional; a {@code null} value
     * disables that predicate so the same query serves the whole filter UI.
     */
    @Query("""
            SELECT j FROM JobListing j
            WHERE j.status = com.khelp.job.entity.ListingStatus.APPROVED
              AND (:query IS NULL OR :query = ''
                   OR LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))
              AND (:jobType IS NULL OR j.jobType = :jobType)
              AND (:location IS NULL OR :location = ''
                   OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
              AND (:visaSponsorship IS NULL OR j.visaSponsorship = :visaSponsorship)
              AND (:koreanRequired IS NULL OR j.koreanRequired = :koreanRequired)
              AND (:minSalary IS NULL OR j.salaryMax IS NULL OR j.salaryMax >= :minSalary)
            """)
    Page<JobListing> search(
            @Param("query") String query,
            @Param("jobType") JobType jobType,
            @Param("location") String location,
            @Param("visaSponsorship") Boolean visaSponsorship,
            @Param("koreanRequired") Boolean koreanRequired,
            @Param("minSalary") BigDecimal minSalary,
            Pageable pageable);

    @Modifying
    @Query("UPDATE JobListing j SET j.viewCount = j.viewCount + 1 WHERE j.id = :id")
    void incrementViewCount(@Param("id") Long id);

    long countByStatus(ListingStatus status);
}
