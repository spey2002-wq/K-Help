package com.khelp.community.dto;

import com.khelp.community.entity.Post;
import com.khelp.community.entity.PostCategory;
import java.time.Instant;

public record PostResponse(
        Long id,
        String title,
        String content,
        PostCategory category,
        Long authorId,
        String authorUsername,
        String authorFullName,
        String authorProfileImageUrl,
        long viewCount,
        long likeCount,
        long commentCount,
        boolean pinned,
        boolean locked,
        Instant createdAt,
        Instant updatedAt
) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getAuthor().getFullName(),
                post.getAuthor().getProfileImageUrl(),
                post.getViewCount(),
                post.getLikeCount(),
                post.getCommentCount(),
                post.isPinned(),
                post.isLocked(),
                post.getCreatedAt(),
                post.getUpdatedAt());
    }
}
