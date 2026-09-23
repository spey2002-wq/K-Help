package com.khelp.auth.entity;

import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A registered K-Help member. Profile fields such as visa type and nationality
 * let the platform tailor guides, jobs and housing results.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
public class User extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", length = 120)
    private String fullName;

    @Column(length = 60)
    private String nationality;

    /** D-2, D-10, E-9, F-4, F-5 ... */
    @Column(name = "visa_type", length = 20)
    private String visaType;

    @Column(name = "preferred_language", length = 10)
    @Builder.Default
    private String preferredLanguage = "en";

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(length = 500)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean suspended = false;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;
}
