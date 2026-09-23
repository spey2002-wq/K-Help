package com.khelp.admin.controller;

import com.khelp.admin.dto.DashboardStatsResponse;
import com.khelp.admin.dto.ListingApprovalRequest;
import com.khelp.admin.dto.ReportResolutionRequest;
import com.khelp.admin.dto.UserModerationRequest;
import com.khelp.admin.service.AdminService;
import com.khelp.auth.dto.UserResponse;
import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import com.khelp.community.dto.ReportResponse;
import com.khelp.community.entity.ReportStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin portal API. Every route requires the {@code ADMIN} role, enforced both by
 * {@link com.khelp.security.SecurityConfig} and {@code @PreAuthorize} here.
 */
@Tag(name = "Admin", description = "User moderation, listing approval and reports")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Dashboard counters")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> stats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.stats()));
    }

    @Operation(summary = "List and search members")
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> listUsers(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listUsers(q, page, size)));
    }

    @Operation(summary = "Suspend, re-enable or change the role of a member")
    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> moderateUser(
            @PathVariable Long id, @Valid @RequestBody UserModerationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User updated",
                adminService.moderateUser(id, request)));
    }

    @Operation(summary = "List job listings awaiting approval")
    @GetMapping("/jobs/pending")
    public ResponseEntity<ApiResponse<PageResponse<?>>> pendingJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listPendingJobListings(page, size)));
    }

    @Operation(summary = "Approve or reject a job listing")
    @PutMapping("/jobs/{id}/approval")
    public ResponseEntity<ApiResponse<Void>> approveJob(
            @PathVariable Long id, @Valid @RequestBody ListingApprovalRequest request) {
        adminService.approveJobListing(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Job listing reviewed", null));
    }

    @Operation(summary = "List housing listings awaiting approval")
    @GetMapping("/housing/pending")
    public ResponseEntity<ApiResponse<PageResponse<?>>> pendingHousing(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listPendingHousingListings(page, size)));
    }

    @Operation(summary = "Approve or reject a housing listing")
    @PutMapping("/housing/{id}/approval")
    public ResponseEntity<ApiResponse<Void>> approveHousing(
            @PathVariable Long id, @Valid @RequestBody ListingApprovalRequest request) {
        adminService.approveHousingListing(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Housing listing reviewed", null));
    }

    @Operation(summary = "List user reports, optionally filtered by status")
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<PageResponse<ReportResponse>>> listReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listReports(status, page, size)));
    }

    @Operation(summary = "Resolve or reject a report")
    @PutMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> resolveReport(
            @PathVariable Long id, @Valid @RequestBody ReportResolutionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Report updated",
                adminService.resolveReport(id, request)));
    }
}
