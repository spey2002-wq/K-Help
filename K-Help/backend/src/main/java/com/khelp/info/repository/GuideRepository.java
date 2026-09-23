package com.khelp.info.repository;

import com.khelp.info.entity.Guide;
import com.khelp.info.entity.GuideCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GuideRepository extends JpaRepository<Guide, Long> {

    Page<Guide> findByPublishedTrue(Pageable pageable);

    Page<Guide> findByCategoryAndPublishedTrue(GuideCategory category, Pageable pageable);

    Page<Guide> findByLanguageCodeAndPublishedTrue(String languageCode, Pageable pageable);

    @Query("""
            SELECT g FROM Guide g
            WHERE g.published = true
              AND (:category IS NULL OR g.category = :category)
              AND (:language IS NULL OR :language = '' OR g.languageCode = :language)
              AND (:query IS NULL OR :query = ''
                   OR LOWER(g.title) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.summary) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.content) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Guide> search(
            @Param("category") GuideCategory category,
            @Param("language") String language,
            @Param("query") String query,
            Pageable pageable);

    @Modifying
    @Query("UPDATE Guide g SET g.viewCount = g.viewCount + 1 WHERE g.id = :id")
    void incrementViewCount(@Param("id") Long id);

    long countByPublishedTrue();
}
