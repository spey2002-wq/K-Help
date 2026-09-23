package com.khelp.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Comment content is required")
        @Size(max = 2000, message = "Comment must be at most 2000 characters")
        String content,

        /** Optional parent comment id to create a threaded reply. */
        Long parentId
) {
}
