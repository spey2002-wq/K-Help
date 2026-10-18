package com.khelp.profile.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/** Full replacement list of skill names. */
public record SkillsRequest(@NotNull(message = "Skills are required") List<String> skills) {
}
