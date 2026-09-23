package com.khelp.community.dto;

import com.khelp.community.entity.PostCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @NotBlank(message = "Content is required")
        String content,

        @NotNull(message = "Category is required")
        PostCategory category
) {
}
