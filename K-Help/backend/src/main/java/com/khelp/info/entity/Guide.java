package com.khelp.info.entity;

import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A curated living guide article for foreign residents, e.g. visa renewal steps
 * or opening a Korean bank account.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "guides", indexes = {
        @Index(name = "idx_guides_category", columnList = "category")
})
public class Guide extends BaseEntity {

    @Column(nullable = false, length = 250)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GuideCategory category;

    /** Country this guide is written for (e.g. "Nepal"); null for guides that apply to everyone. */
    @Column(length = 60)
    private String country;

    @Column(name = "language_code", nullable = false, length = 10)
    @Builder.Default
    private String languageCode = "en";

    /** Optional official source link for verification. */
    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean published = true;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private long viewCount = 0L;
}
