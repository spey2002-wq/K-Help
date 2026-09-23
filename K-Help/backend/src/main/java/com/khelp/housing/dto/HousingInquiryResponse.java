package com.khelp.housing.dto;

import com.khelp.housing.entity.HousingInquiry;
import com.khelp.housing.entity.InquiryStatus;
import java.time.Instant;
import java.time.LocalDate;

public record HousingInquiryResponse(
        Long id,
        Long housingListingId,
        String listingTitle,
        Long inquirerId,
        String inquirerUsername,
        String message,
        String contactPhone,
        LocalDate preferredMoveInDate,
        InquiryStatus status,
        String ownerReply,
        Instant createdAt
) {

    public static HousingInquiryResponse from(HousingInquiry inquiry) {
        return new HousingInquiryResponse(
                inquiry.getId(),
                inquiry.getHousingListing().getId(),
                inquiry.getHousingListing().getTitle(),
                inquiry.getInquirer().getId(),
                inquiry.getInquirer().getUsername(),
                inquiry.getMessage(),
                inquiry.getContactPhone(),
                inquiry.getPreferredMoveInDate(),
                inquiry.getStatus(),
                inquiry.getOwnerReply(),
                inquiry.getCreatedAt());
    }
}
