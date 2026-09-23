package com.khelp.housing.dto;

import com.khelp.housing.entity.InquiryStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Listing owner's response to a tenant inquiry.
 */
public record InquiryReplyRequest(
        @NotNull(message = "Status is required")
        InquiryStatus status,

        String ownerReply
) {
}
