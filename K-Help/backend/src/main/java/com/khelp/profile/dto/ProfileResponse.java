package com.khelp.profile.dto;

import com.khelp.auth.dto.UserResponse;
import java.util.List;

/** Everything shown on a member's profile page. */
public record ProfileResponse(
        UserResponse user,
        List<String> skills,
        List<ExperienceResponse> experiences,
        List<PhotoResponse> photos
) {
}
