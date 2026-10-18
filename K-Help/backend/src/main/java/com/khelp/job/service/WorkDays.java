package com.khelp.job.service;

import com.khelp.common.exception.ApiException;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

/**
 * Helper for the {@code work_days} column, which stores day codes as a comma
 * separated string in Monday-to-Sunday order (for example {@code "SAT,SUN"}).
 */
public final class WorkDays {

    public static final List<String> ALL = List.of("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN");

    private WorkDays() {
    }

    /**
     * Validates and normalises day codes. Returns null when no days were given
     * or every day was chosen, since both mean "no fixed schedule".
     */
    public static String toStorage(Collection<String> days) {
        if (days == null || days.isEmpty()) {
            return null;
        }
        List<String> normalised = days.stream()
                .map(day -> day == null ? "" : day.trim().toUpperCase(Locale.ROOT))
                .toList();
        for (String day : normalised) {
            if (!ALL.contains(day)) {
                throw ApiException.badRequest("Unknown work day: " + day);
            }
        }
        List<String> ordered = ALL.stream().filter(normalised::contains).toList();
        return ordered.size() == ALL.size() ? null : String.join(",", ordered);
    }

    public static List<String> fromStorage(String stored) {
        if (stored == null || stored.isBlank()) {
            return List.of();
        }
        return List.of(stored.split(","));
    }
}
