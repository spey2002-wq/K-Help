package com.khelp.common.dto;

import java.time.Instant;

/**
 * Uniform envelope returned by every REST endpoint.
 *
 * @param success whether the request succeeded
 * @param message human-readable summary
 * @param data    response payload, may be {@code null}
 * @param timestamp server time of the response
 */
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp
) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "OK", data, Instant.now());
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, Instant.now());
    }
}
