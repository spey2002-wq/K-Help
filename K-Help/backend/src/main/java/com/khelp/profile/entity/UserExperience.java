package com.khelp.profile.entity;

import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** One work, education or other experience entry on a member's profile. */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_experiences")
public class UserExperience extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ExperienceKind kind = ExperienceKind.WORK;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 120)
    private String organization;

    @Column(length = 120)
    private String location;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    /** True for something the member is still doing; end date is then ignored. */
    @Column(name = "is_current", nullable = false)
    private boolean current;

    @Column(length = 1000)
    private String description;
}
