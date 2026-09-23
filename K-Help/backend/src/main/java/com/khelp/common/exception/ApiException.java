package com.khelp.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Business-level exception carrying the HTTP status the API should return.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static ApiException notFound(String resource) {
        return new ApiException(resource + " not found", HttpStatus.NOT_FOUND);
    }

    public static ApiException badRequest(String message) {
        return new ApiException(message, HttpStatus.BAD_REQUEST);
    }

    public static ApiException conflict(String message) {
        return new ApiException(message, HttpStatus.CONFLICT);
    }

    public static ApiException forbidden(String message) {
        return new ApiException(message, HttpStatus.FORBIDDEN);
    }
}
