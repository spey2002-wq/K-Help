package com.khelp.job.entity;

/**
 * Lifecycle of a job application submitted through the platform.
 */
public enum ApplicationStatus {
    SUBMITTED,
    REVIEWING,
    SHORTLISTED,
    INTERVIEW,
    ACCEPTED,
    REJECTED,
    WITHDRAWN
}
