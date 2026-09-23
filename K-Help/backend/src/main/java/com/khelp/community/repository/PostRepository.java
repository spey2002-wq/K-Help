package com.khelp.community.repository;

import com.khelp.community.entity.Post;
import com.khelp.community.entity.PostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByDeletedFalse(Pageable pageable);

    Page<Post> findByCategoryAndDeletedFalse(PostCategory category, Pageable pageable);

    Page<Post> findByAuthorIdAndDeletedFalse(Long authorId, Pageable pageable);

    @Query("""
            SELECT p FROM Post p
            WHERE p.deleted = false
              AND (:category IS NULL OR p.category = :category)
              AND (:query IS NULL OR :query = ''
                   OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Post> search(
            @Param("category") PostCategory category,
            @Param("query") String query,
            Pageable pageable);

    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Post p SET p.commentCount = p.commentCount + 1 WHERE p.id = :id")
    void incrementCommentCount(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Post p SET p.commentCount = CASE WHEN p.commentCount > 0 THEN p.commentCount - 1 ELSE 0 END WHERE p.id = :id")
    void decrementCommentCount(@Param("id") Long id);

    long countByDeletedFalse();
}
