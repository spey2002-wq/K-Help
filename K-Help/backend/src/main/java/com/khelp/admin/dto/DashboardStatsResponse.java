package com.khelp.admin.dto;

/**
 * Aggregate counters for the admin dashboard.
 */
public record DashboardStatsResponse(
        long totalUsers,
        long suspendedUsers,
        long totalPosts,
        long publishedGuides,
        long pendingJobs,
        long approvedJobs,
        long pendingHousing,
        long availableHousing,
        long pendingReports
) {
}
