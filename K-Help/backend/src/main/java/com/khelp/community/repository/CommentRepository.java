package com.khelp.community.repository;

import com.khelp.community.entity.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndDeletedFalseOrderByCreatedAtAsc(Long postId);

    List<Comment> findByParentIdAndDeletedFalseOrderByCreatedAtAsc(Long parentId);

    long countByPostIdAndDeletedFalse(Long postId);
}
