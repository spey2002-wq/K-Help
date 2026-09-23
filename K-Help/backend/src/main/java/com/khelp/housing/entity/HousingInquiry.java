package com.khelp.housing.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A tenant's inquiry about a {@link HousingListing}.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "housing_inquiries")
public class HousingInquiry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "housing_listing_id", nullable = false)
    private HousingListing housingListing;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inquirer_id", nullable = false)
    private User inquirer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "preferred_move_in_date")
    private LocalDate preferredMoveInDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.NEW;

    @Column(name = "owner_reply", columnDefinition = "TEXT")
    private String ownerReply;
}
