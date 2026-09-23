package com.khelp.job.controller;

import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import com.khelp.job.dto.ApplicationStatusUpdateRequest;
import com.khelp.job.dto.JobApplicationRequest;
import com.khelp.job.dto.JobApplicationResponse;
import com.khelp.job.dto.JobListingRequest;
import com.khelp.job.dto.JobListingResponse;
import com.khelp.job.entity.JobType;
import com.khelp.job.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Foreigner-friendly job listings, search and application tracking.
 */
@Tag(name = "Jobs", description = "Job listings, filtering and applications")
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @Operation(summary = "Search approved job listings with filters")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobListingResponse>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean visaSponsorship,
            @RequestParam(required = false) Boolean koreanRequired,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.search(
                q, jobType, location, visaSponsorship, koreanRequired, minSalary, page, size)));
    }

    @Operation(summary = "Get a job listing by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobListingResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getById(id)));
    }

    @Operation(summary = "Create a job listing (awaits admin approval)")
    @PostMapping
    public ResponseEntity<ApiResponse<JobListingResponse>> create(
            @Valid @RequestBody JobListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job listing submitted for approval", jobService.create(request)));
    }

    @Operation(summary = "Update a job listing you posted")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobListingResponse>> update(
            @PathVariable Long id, @Valid @RequestBody JobListingRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok("Job listing updated", jobService.update(id, request)));
    }

    @Operation(summary = "Close a job listing you posted")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        jobService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Job listing closed", null));
    }

    @Operation(summary = "Apply to a job listing")
    @PostMapping("/{id}/applications")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> apply(
            @PathVariable Long id, @Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted", jobService.apply(id, request)));
    }

    @Operation(summary = "List applications for a listing you posted")
    @GetMapping("/{id}/applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> applications(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.applicationsForListing(id)));
    }

    @Operation(summary = "List the current member's job applications")
    @GetMapping("/applications/me")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> myApplications() {
        return ResponseEntity.ok(ApiResponse.ok(jobService.myApplications()));
    }

    @Operation(summary = "Update an application's status (listing owner or admin)")
    @PutMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Application status updated",
                jobService.updateApplicationStatus(applicationId, request)));
    }

    @Operation(summary = "Withdraw your own job application")
    @DeleteMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<Void>> withdraw(@PathVariable Long applicationId) {
        jobService.withdrawApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.ok("Application withdrawn", null));
    }
}
