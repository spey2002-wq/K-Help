package com.khelp.job.dto;

import jakarta.validation.constraints.Size;

public record JobApplicationRequest(
        String coverLetter,

        @Size(max = 500)
        String resumeUrl
) {
}
