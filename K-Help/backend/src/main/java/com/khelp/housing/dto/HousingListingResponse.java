package com.khelp.housing.dto;

import com.khelp.housing.entity.HousingListing;
import com.khelp.housing.entity.PropertyStatus;
import com.khelp.housing.entity.PropertyType;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public record HousingListingResponse(
        Long id,
        String title,
        String description,
        PropertyType propertyType,
        String city,
        String district,
        String neighborhood,
        String addressLine,
        BigDecimal depositAmount,
        BigDecimal monthlyRent,
        BigDecimal maintenanceFee,
        String currency,
        BigDecimal areaSqm,
        Integer roomCount,
        Integer bathroomCount,
        Integer floorNumber,
        LocalDate availableFrom,
        boolean furnished,
        boolean petFriendly,
        boolean utilitiesIncluded,
        List<String> imageUrls,
        String contactPhone,
        String contactEmail,
        Long listedById,
        String listedByUsername,
        PropertyStatus status,
        long viewCount,
        Instant createdAt
) {

    public static HousingListingResponse from(HousingListing listing) {
        return new HousingListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getPropertyType(),
                listing.getCity(),
                listing.getDistrict(),
                listing.getNeighborhood(),
                listing.getAddressLine(),
                listing.getDepositAmount(),
                listing.getMonthlyRent(),
                listing.getMaintenanceFee(),
                listing.getCurrency(),
                listing.getAreaSqm(),
                listing.getRoomCount(),
                listing.getBathroomCount(),
                listing.getFloorNumber(),
                listing.getAvailableFrom(),
                listing.isFurnished(),
                listing.isPetFriendly(),
                listing.isUtilitiesIncluded(),
                parseImages(listing.getImageUrls()),
                listing.getContactPhone(),
                listing.getContactEmail(),
                listing.getListedBy().getId(),
                listing.getListedBy().getUsername(),
                listing.getStatus(),
                listing.getViewCount(),
                listing.getCreatedAt());
    }

    /** List-view projection that omits the full description and address. */
    public static HousingListingResponse summaryOf(HousingListing listing) {
        return new HousingListingResponse(
                listing.getId(),
                listing.getTitle(),
                null,
                listing.getPropertyType(),
                listing.getCity(),
                listing.getDistrict(),
                listing.getNeighborhood(),
                null,
                listing.getDepositAmount(),
                listing.getMonthlyRent(),
                listing.getMaintenanceFee(),
                listing.getCurrency(),
                listing.getAreaSqm(),
                listing.getRoomCount(),
                listing.getBathroomCount(),
                listing.getFloorNumber(),
                listing.getAvailableFrom(),
                listing.isFurnished(),
                listing.isPetFriendly(),
                listing.isUtilitiesIncluded(),
                parseImages(listing.getImageUrls()),
                null,
                null,
                listing.getListedBy().getId(),
                listing.getListedBy().getUsername(),
                listing.getStatus(),
                listing.getViewCount(),
                listing.getCreatedAt());
    }

    private static List<String> parseImages(String imageUrls) {
        if (imageUrls == null || imageUrls.isBlank()) {
            return List.of();
        }
        return Arrays.stream(imageUrls.split(","))
                .map(String::trim)
                .filter(url -> !url.isEmpty())
                .toList();
    }
}
