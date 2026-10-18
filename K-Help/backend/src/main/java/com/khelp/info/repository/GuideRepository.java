package com.khelp.info.repository;

import com.khelp.info.entity.Guide;
import com.khelp.info.entity.GuideCategory;
import java.util.List;
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
              AND (:country IS NULL OR :country = '' OR LOWER(g.country) = LOWER(:country))
              AND (:query IS NULL OR :query = ''
                   OR LOWER(g.title) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.summary) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.content) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Guide> search(
            @Param("category") GuideCategory category,
            @Param("language") String language,
            @Param("country") String country,
            @Param("query") String query,
            Pageable pageable);

    /** Countries that currently have at least one published guide, alphabetically. */
    @Query("""
            SELECT DISTINCT g.country FROM Guide g
            WHERE g.published = true AND g.country IS NOT NULL AND g.country <> ''
            ORDER BY g.country
            """)
    List<String> findPublishedCountries();

    @Modifying
    @Query("UPDATE Guide g SET g.viewCount = g.viewCount + 1 WHERE g.id = :id")
    void incrementViewCount(@Param("id") Long id);

    long countByPublishedTrue();
}
