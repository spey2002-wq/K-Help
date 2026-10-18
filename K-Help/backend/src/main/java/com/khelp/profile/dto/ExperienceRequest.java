package com.khelp.profile.dto;

import com.khelp.profile.entity.ExperienceKind;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ExperienceRequest(
        ExperienceKind kind,

        @NotBlank(message = "Title is required")
        @Size(max = 120)
        String title,

        @Size(max = 120)
        String organization,

        @Size(max = 120)
        String location,

        LocalDate startDate,

        LocalDate endDate,

        Boolean current,

        @Size(max = 1000)
        String description
) {
}
