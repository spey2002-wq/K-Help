package com.khelp.community.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A community forum post, optionally pinned or locked by moderators.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_posts_category", columnList = "category"),
        @Index(name = "idx_posts_author", columnList = "author_id")
})
public class Post extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PostCategory category = PostCategory.GENERAL;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private long viewCount = 0L;

    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private long likeCount = 0L;

    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private long commentCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private boolean pinned = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean locked = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
