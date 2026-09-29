package com.khelp.job.service;

import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.job.dto.ApplicationStatusUpdateRequest;
import com.khelp.job.dto.JobApplicationRequest;
import com.khelp.job.dto.JobApplicationResponse;
import com.khelp.job.dto.JobListingRequest;
import com.khelp.job.dto.JobListingResponse;
import com.khelp.job.dto.JobSearchCriteria;
import com.khelp.job.entity.ApplicationStatus;
import com.khelp.job.entity.JobApplication;
import com.khelp.job.entity.JobListing;
import com.khelp.job.entity.JobType;
import com.khelp.job.entity.ListingStatus;
import com.khelp.job.repository.JobApplicationRepository;
import com.khelp.job.repository.JobListingRepository;
import com.khelp.security.SecurityUtils;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Job board: listing CRUD, multi-criteria search and application tracking.
 */
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobListingRepository jobListingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<JobListingResponse> search(JobSearchCriteria criteria, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // "No limit" values are passed as plain defaults rather than nulls so the
        // database never has to infer the type of an untyped NULL parameter.
        int maxHours = criteria.maxHoursPerWeek() != null
                ? criteria.maxHoursPerWeek() : Integer.MAX_VALUE;
        Instant postedAfter = criteria.postedWithinDays() != null && criteria.postedWithinDays() > 0
                ? Instant.now().minus(criteria.postedWithinDays(), ChronoUnit.DAYS)
                : Instant.EPOCH;

        Page<JobListing> jobs = jobListingRepository.search(
                criteria.query(),
                criteria.jobType(),
                criteria.location(),
                criteria.visaSponsorship(),
                criteria.koreanRequired(),
                criteria.minSalary(),
                criteria.maxSalary(),
                criteria.salaryPeriod(),
                criteria.shift(),
                criteria.experienceLevel(),
                maxHours,
                postedAfter,
                pageable);

        return PageResponse.from(jobs.map(JobListingResponse::summaryOf));
    }

    @Transactional
    public JobListingResponse getById(Long id) {
        JobListing job = requireListing(id);

        // Draft listings are only visible to their owner and admins.
        if (job.getStatus() != ListingStatus.APPROVED && !isOwnerOrAdmin(job)) {
            throw ApiException.notFound("Job listing");
        }

        jobListingRepository.incrementViewCount(id);
        job.setViewCount(job.getViewCount() + 1);

        return JobListingResponse.from(job);
    }

    @Transactional
    public JobListingResponse create(JobListingRequest request) {
        User poster = requireCurrentUser();

        JobListing job = JobListing.builder()
                .title(request.title())
                .company(request.company())
                .description(request.description())
                .requirements(request.requirements())
                .jobType(request.jobType())
                .location(request.location())
                .visaSponsorship(Boolean.TRUE.equals(request.visaSponsorship()))
                .koreanRequired(request.koreanRequired() == null || request.koreanRequired())
                .salaryMin(request.salaryMin())
                .salaryMax(request.salaryMax())
                .salaryCurrency(StringUtils.hasText(request.salaryCurrency())
                        ? request.salaryCurrency() : "KRW")
                .salaryPeriod(request.salaryPeriod())
                .shift(request.shift())
                .hoursPerWeek(request.hoursPerWeek())
                .experienceLevel(request.experienceLevel())
                .contactEmail(request.contactEmail())
                .deadline(request.deadline())
                .postedBy(poster)
                // Admins can publish directly; everyone else awaits moderation.
                .status(SecurityUtils.hasRole("ADMIN") ? ListingStatus.APPROVED : ListingStatus.PENDING)
                .build();

        return JobListingResponse.from(jobListingRepository.save(job));
    }

    @Transactional
    public JobListingResponse update(Long id, JobListingRequest request) {
        JobListing job = requireListing(id);
        assertOwnerOrAdmin(job);

        job.setTitle(request.title());
        job.setCompany(request.company());
        job.setDescription(request.description());
        job.setRequirements(request.requirements());
        job.setJobType(request.jobType());
        job.setLocation(request.location());
        if (request.visaSponsorship() != null) {
            job.setVisaSponsorship(request.visaSponsorship());
        }
        if (request.koreanRequired() != null) {
            job.setKoreanRequired(request.koreanRequired());
        }
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        if (StringUtils.hasText(request.salaryCurrency())) {
            job.setSalaryCurrency(request.salaryCurrency());
        }
        job.setSalaryPeriod(request.salaryPeriod());
        job.setShift(request.shift());
        job.setHoursPerWeek(request.hoursPerWeek());
        job.setExperienceLevel(request.experienceLevel());
        job.setContactEmail(request.contactEmail());
        job.setDeadline(request.deadline());

        return JobListingResponse.from(jobListingRepository.save(job));
    }

    @Transactional
    public void delete(Long id) {
        JobListing job = requireListing(id);
        assertOwnerOrAdmin(job);

        job.setStatus(ListingStatus.CLOSED);
        jobListingRepository.save(job);
    }

    // --------------------------------------------------------- applications

    @Transactional
    public JobApplicationResponse apply(Long jobId, JobApplicationRequest request) {
        User applicant = requireCurrentUser();
        JobListing job = requireListing(jobId);

        if (job.getStatus() != ListingStatus.APPROVED) {
            throw ApiException.badRequest("This listing is not open for applications");
        }
        if (jobApplicationRepository.existsByJobListingIdAndApplicantId(jobId, applicant.getId())) {
            throw ApiException.conflict("You have already applied to this listing");
        }
        if (job.getPostedBy().getId().equals(applicant.getId())) {
            throw ApiException.badRequest("You cannot apply to your own listing");
        }

        JobApplication application = JobApplication.builder()
                .jobListing(job)
                .applicant(applicant)
                .coverLetter(request.coverLetter())
                .resumeUrl(request.resumeUrl())
                .status(ApplicationStatus.SUBMITTED)
                .build();

        return JobApplicationResponse.from(jobApplicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> myApplications() {
        User applicant = requireCurrentUser();
        return jobApplicationRepository.findByApplicantIdOrderByCreatedAtDesc(applicant.getId())
                .stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> applicationsForListing(Long jobId) {
        JobListing job = requireListing(jobId);
        assertOwnerOrAdmin(job);

        return jobApplicationRepository.findByJobListingIdOrderByCreatedAtDesc(jobId)
                .stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @Transactional
    public JobApplicationResponse updateApplicationStatus(
            Long applicationId, ApplicationStatusUpdateRequest request) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application"));

        assertOwnerOrAdmin(application.getJobListing());

        application.setStatus(request.status());
        application.setEmployerNote(request.employerNote());

        return JobApplicationResponse.from(jobApplicationRepository.save(application));
    }

    @Transactional
    public void withdrawApplication(Long applicationId) {
        User applicant = requireCurrentUser();
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application"));

        if (!application.getApplicant().getId().equals(applicant.getId())) {
            throw ApiException.forbidden("You can only withdraw your own application");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        jobApplicationRepository.save(application);
    }

    // ------------------------------------------------------------- helpers

    private JobListing requireListing(Long id) {
        return jobListingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Job listing"));
    }

    private User requireCurrentUser() {
        return userRepository.findByUsername(SecurityUtils.currentUsername())
                .orElseThrow(() -> ApiException.notFound("User"));
    }

    private boolean isOwnerOrAdmin(JobListing job) {
        String current = SecurityUtils.currentUsername();
        return (current != null && current.equals(job.getPostedBy().getUsername()))
                || SecurityUtils.hasRole("ADMIN");
    }

    private void assertOwnerOrAdmin(JobListing job) {
        if (!isOwnerOrAdmin(job)) {
            throw ApiException.forbidden("You can only manage your own listings");
        }
    }
}
