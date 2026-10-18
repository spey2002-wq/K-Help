package com.khelp.profile.dto;

import com.khelp.profile.entity.ExperienceKind;
import com.khelp.profile.entity.UserExperience;
import java.time.LocalDate;

public record ExperienceResponse(
        Long id,
        ExperienceKind kind,
        String title,
        String organization,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        boolean current,
        String description
) {

    public static ExperienceResponse from(UserExperience e) {
        return new ExperienceResponse(
                e.getId(),
                e.getKind(),
                e.getTitle(),
                e.getOrganization(),
                e.getLocation(),
                e.getStartDate(),
                e.getEndDate(),
                e.isCurrent(),
                e.getDescription());
    }
}
