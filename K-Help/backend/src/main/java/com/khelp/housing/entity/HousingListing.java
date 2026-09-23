package com.khelp.housing.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A housing listing. Korean rentals use a deposit ({@code depositAmount}) plus
 * optional monthly rent ({@code monthlyRent}), so both are first-class fields.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "housing_listings", indexes = {
        @Index(name = "idx_housing_status", columnList = "status"),
        @Index(name = "idx_housing_city", columnList = "city"),
        @Index(name = "idx_housing_type", columnList = "property_type")
})
public class HousingListing extends BaseEntity {

    @Column(nullable = false, length = 250)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 20)
    private PropertyType propertyType;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String neighborhood;

    @Column(name = "address_line", length = 300)
    private String addressLine;

    @Column(name = "deposit_amount", precision = 14, scale = 2)
    private BigDecimal depositAmount;

    @Column(name = "monthly_rent", precision = 14, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "maintenance_fee", precision = 12, scale = 2)
    private BigDecimal maintenanceFee;

    @Column(name = "currency", length = 10)
    @Builder.Default
    private String currency = "KRW";

    @Column(name = "area_sqm", precision = 8, scale = 2)
    private BigDecimal areaSqm;

    @Column(name = "room_count")
    private Integer roomCount;

    @Column(name = "bathroom_count")
    private Integer bathroomCount;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "available_from")
    private LocalDate availableFrom;

    @Column(name = "furnished", nullable = false)
    @Builder.Default
    private boolean furnished = false;

    @Column(name = "pet_friendly", nullable = false)
    @Builder.Default
    private boolean petFriendly = false;

    @Column(name = "utilities_included", nullable = false)
    @Builder.Default
    private boolean utilitiesIncluded = false;

    /** Comma-separated image URLs kept simple for the baseline. */
    @Column(name = "image_urls", length = 1000)
    private String imageUrls;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "listed_by", nullable = false)
    private User listedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.PENDING;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private long viewCount = 0L;
}
