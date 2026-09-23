package com.khelp.community.dto;

import com.khelp.community.entity.Comment;
import java.time.Instant;
import java.util.List;

public record CommentResponse(
        Long id,
        String content,
        Long postId,
        Long authorId,
        String authorUsername,
        String authorFullName,
        String authorProfileImageUrl,
        Long parentId,
        List<CommentResponse> replies,
        Instant createdAt
) {

    public static CommentResponse from(Comment comment, List<CommentResponse> replies) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getPost().getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getUsername(),
                comment.getAuthor().getFullName(),
                comment.getAuthor().getProfileImageUrl(),
                comment.getParent() != null ? comment.getParent().getId() : null,
                replies,
                comment.getCreatedAt());
    }

    public static CommentResponse from(Comment comment) {
        return from(comment, List.of());
    }
}
