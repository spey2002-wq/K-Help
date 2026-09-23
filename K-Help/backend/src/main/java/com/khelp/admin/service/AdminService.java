package com.khelp.admin.service;

import com.khelp.admin.dto.DashboardStatsResponse;
import com.khelp.admin.dto.ListingApprovalRequest;
import com.khelp.admin.dto.ReportResolutionRequest;
import com.khelp.admin.dto.UserModerationRequest;
import com.khelp.auth.dto.UserResponse;
import com.khelp.auth.entity.Role;
import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.community.dto.ReportResponse;
import com.khelp.community.entity.Report;
import com.khelp.community.entity.ReportStatus;
import com.khelp.community.repository.PostRepository;
import com.khelp.community.repository.ReportRepository;
import com.khelp.housing.entity.PropertyStatus;
import com.khelp.housing.repository.HousingListingRepository;
import com.khelp.info.repository.GuideRepository;
import com.khelp.job.entity.ListingStatus;
import com.khelp.job.repository.JobListingRepository;
import com.khelp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Admin moderation: member management, listing approval and report handling.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final GuideRepository guideRepository;
    private final JobListingRepository jobListingRepository;
    private final HousingListingRepository housingListingRepository;
    private final ReportRepository reportRepository;

    // --------------------------------------------------------------- users

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = userRepository.search(query, pageable);
        return PageResponse.from(users.map(UserResponse::from));
    }

    @Transactional
    public UserResponse moderateUser(Long userId, UserModerationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User"));

        if (user.getUsername().equals(SecurityUtils.currentUsername())) {
            throw ApiException.badRequest("You cannot moderate your own account");
        }

        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }
        if (request.suspended() != null) {
            user.setSuspended(request.suspended());
        }
        if (StringUtils.hasText(request.role())) {
            try {
                user.setRole(Role.valueOf(request.role().toUpperCase()));
            } catch (IllegalArgumentException ex) {
                throw ApiException.badRequest("Unknown role: " + request.role());
            }
        }

        log.info("Admin '{}' moderated user '{}' ({})",
                SecurityUtils.currentUsername(), user.getUsername(), request.reason());

        return UserResponse.from(userRepository.save(user));
    }

    // ------------------------------------------------------------ listings

    @Transactional
    public void approveJobListing(Long jobId, ListingApprovalRequest request) {
        var job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> ApiException.notFound("Job listing"));

        job.setStatus(request.approved() ? ListingStatus.APPROVED : ListingStatus.REJECTED);
        jobListingRepository.save(job);

        log.info("Admin {} job listing {} ({})",
                request.approved() ? "approved" : "rejected", jobId, request.note());
    }

    @Transactional
    public void approveHousingListing(Long listingId, ListingApprovalRequest request) {
        var listing = housingListingRepository.findById(listingId)
                .orElseThrow(() -> ApiException.notFound("Housing listing"));

        listing.setStatus(request.approved() ? PropertyStatus.AVAILABLE : PropertyStatus.REJECTED);
        housingListingRepository.save(listing);

        log.info("Admin {} housing listing {} ({})",
                request.approved() ? "approved" : "rejected", listingId, request.note());
    }

    @Transactional(readOnly = true)
    public PageResponse<?> listPendingJobListings(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return PageResponse.from(jobListingRepository.findByStatus(ListingStatus.PENDING, pageable)
                .map(com.khelp.job.dto.JobListingResponse::summaryOf));
    }

    @Transactional(readOnly = true)
    public PageResponse<?> listPendingHousingListings(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return PageResponse.from(housingListingRepository.findByStatus(PropertyStatus.PENDING, pageable)
                .map(com.khelp.housing.dto.HousingListingResponse::summaryOf));
    }

    // ------------------------------------------------------------- reports

    @Transactional(readOnly = true)
    public PageResponse<ReportResponse> listReports(ReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Report> reports = status != null
                ? reportRepository.findByStatus(status, pageable)
                : reportRepository.findAll(pageable);

        return PageResponse.from(reports.map(ReportResponse::from));
    }

    @Transactional
    public ReportResponse resolveReport(Long reportId, ReportResolutionRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> ApiException.notFound("Report"));

        User admin = userRepository.findByUsername(SecurityUtils.currentUsername())
                .orElseThrow(() -> ApiException.notFound("User"));

        report.setStatus(request.status());
        report.setResolutionNote(request.resolutionNote());
        report.setHandledBy(admin);

        return ReportResponse.from(reportRepository.save(report));
    }

    // --------------------------------------------------------------- stats

    @Transactional(readOnly = true)
    public DashboardStatsResponse stats() {
        return new DashboardStatsResponse(
                userRepository.count(),
                userRepository.countBySuspendedTrue(),
                postRepository.countByDeletedFalse(),
                guideRepository.countByPublishedTrue(),
                jobListingRepository.countByStatus(ListingStatus.PENDING),
                jobListingRepository.countByStatus(ListingStatus.APPROVED),
                housingListingRepository.countByStatus(PropertyStatus.PENDING),
                housingListingRepository.countByStatus(PropertyStatus.AVAILABLE),
                reportRepository.countByStatus(ReportStatus.PENDING));
    }
}
