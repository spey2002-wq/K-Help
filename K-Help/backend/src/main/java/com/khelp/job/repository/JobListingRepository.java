package com.khelp.job.repository;

import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.ListingStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Job board search runs through {@link JobSpecifications} (see
 * {@link JpaSpecificationExecutor#findAll}) so filters can be combined freely.
 */
public interface JobListingRepository
        extends JpaRepository<JobListing, Long>, JpaSpecificationExecutor<JobListing> {

    Page<JobListing> findByStatus(ListingStatus status, Pageable pageable);

    Page<JobListing> findByPostedById(Long postedById, Pageable pageable);

    @Modifying
    @Query("UPDATE JobListing j SET j.viewCount = j.viewCount + 1 WHERE j.id = :id")
    void incrementViewCount(@Param("id") Long id);

    long countByStatus(ListingStatus status);

    /** Titles and company names of open listings that contain the typed text. */
    @Query("""
            SELECT DISTINCT j.title FROM JobListing j
            WHERE j.status = com.khelp.job.entity.ListingStatus.APPROVED
              AND LOWER(j.title) LIKE LOWER(CONCAT('%', :text, '%')) ESCAPE '\\'
            ORDER BY j.title
            """)
    List<String> findTitleSuggestions(@Param("text") String text, Pageable pageable);

    @Query("""
            SELECT DISTINCT j.company FROM JobListing j
            WHERE j.status = com.khelp.job.entity.ListingStatus.APPROVED
              AND LOWER(j.company) LIKE LOWER(CONCAT('%', :text, '%')) ESCAPE '\\'
            ORDER BY j.company
            """)
    List<String> findCompanySuggestions(@Param("text") String text, Pageable pageable);
}
