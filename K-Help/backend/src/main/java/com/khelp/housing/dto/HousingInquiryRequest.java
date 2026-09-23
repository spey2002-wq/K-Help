package com.khelp.housing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record HousingInquiryRequest(
        @NotBlank(message = "Message is required")
        String message,

        @Size(max = 50)
        String contactPhone,

        LocalDate preferredMoveInDate
) {
}
