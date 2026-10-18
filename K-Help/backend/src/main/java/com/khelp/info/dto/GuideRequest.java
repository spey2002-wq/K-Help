package com.khelp.info.dto;

import com.khelp.info.entity.GuideCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GuideRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 250)
        String title,

        @NotBlank(message = "Summary is required")
        @Size(max = 500)
        String summary,

        @NotBlank(message = "Content is required")
        String content,

        @NotNull(message = "Category is required")
        GuideCategory category,

        @Size(max = 60)
        String country,

        @Size(max = 10)
        String languageCode,

        @Size(max = 500)
        String sourceUrl,

        Boolean published
) {
}
