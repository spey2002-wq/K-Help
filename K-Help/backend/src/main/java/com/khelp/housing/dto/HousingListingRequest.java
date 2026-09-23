package com.khelp.housing.dto;

import com.khelp.housing.entity.PropertyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record HousingListingRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 250)
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Property type is required")
        PropertyType propertyType,

        @Size(max = 100)
        String city,

        @Size(max = 100)
        String district,

        @Size(max = 100)
        String neighborhood,

        @Size(max = 300)
        String addressLine,

        BigDecimal depositAmount,

        BigDecimal monthlyRent,

        BigDecimal maintenanceFee,

        @Size(max = 10)
        String currency,

        BigDecimal areaSqm,

        Integer roomCount,

        Integer bathroomCount,

        Integer floorNumber,

        LocalDate availableFrom,

        Boolean furnished,

        Boolean petFriendly,

        Boolean utilitiesIncluded,

        @Size(max = 1000)
        String imageUrls,

        @Size(max = 50)
        String contactPhone,

        @Size(max = 150)
        String contactEmail
) {
}
