package com.khelp.info.dto;

import com.khelp.info.entity.Guide;
import com.khelp.info.entity.GuideCategory;
import java.time.Instant;

public record GuideResponse(
        Long id,
        String title,
        String summary,
        String content,
        GuideCategory category,
        String country,
        String languageCode,
        String sourceUrl,
        long viewCount,
        Instant updatedAt
) {

    public static GuideResponse from(Guide guide) {
        return new GuideResponse(
                guide.getId(),
                guide.getTitle(),
                guide.getSummary(),
                guide.getContent(),
                guide.getCategory(),
                guide.getCountry(),
                guide.getLanguageCode(),
                guide.getSourceUrl(),
                guide.getViewCount(),
                guide.getUpdatedAt());
    }

    /** Lightweight projection for list views that omit the full article body. */
    public static GuideResponse summaryOf(Guide guide) {
        return new GuideResponse(
                guide.getId(),
                guide.getTitle(),
                guide.getSummary(),
                null,
                guide.getCategory(),
                guide.getCountry(),
                guide.getLanguageCode(),
                guide.getSourceUrl(),
                guide.getViewCount(),
                guide.getUpdatedAt());
    }
}
