package com.khelp.job.entity;

import org.springframework.data.domain.Sort;

/**
 * Ordering choices offered on the job board. Every option falls back to newest
 * first so paging stays stable.
 */
public enum JobSort {
    NEWEST,
    MOST_VIEWED,
    DEADLINE_SOON,
    PAY_HIGH,
    PAY_LOW;

    public Sort toSort() {
        Sort newest = Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (this) {
            case NEWEST -> newest;
            case MOST_VIEWED -> Sort.by(Sort.Direction.DESC, "viewCount").and(newest);
            case DEADLINE_SOON -> Sort.by(Sort.Order.asc("deadline").nullsLast()).and(newest);
            case PAY_HIGH -> Sort.by(Sort.Order.desc("salaryMax").nullsLast()).and(newest);
            case PAY_LOW -> Sort.by(Sort.Order.asc("salaryMin").nullsLast()).and(newest);
        };
    }
}
