package com.khelp.auth.controller;

import com.khelp.auth.dto.AuthResponse;
import com.khelp.auth.dto.LoginRequest;
import com.khelp.auth.dto.RefreshTokenRequest;
import com.khelp.auth.dto.RegisterRequest;
import com.khelp.auth.dto.UpdateProfileRequest;
import com.khelp.auth.dto.UserResponse;
import com.khelp.auth.service.AuthService;
import com.khelp.common.dto.ApiResponse;
import com.khelp.security.LoginRateLimiter;
import com.khelp.security.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication and profile endpoints.
 */
@Tag(name = "Auth", description = "Registration, login, token refresh and profile")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final LoginRateLimiter loginRateLimiter;

    @Operation(summary = "Register a new member")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration successful", authService.register(request)));
    }

    @Operation(summary = "Sign in with username/email and password")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        String address = LoginRateLimiter.clientAddress(httpRequest);
        loginRateLimiter.checkAllowed(request.username(), address);
        try {
            AuthResponse response = authService.login(request);
            loginRateLimiter.recordSuccess(request.username(), address);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (BadCredentialsException ex) {
            loginRateLimiter.recordFailure(request.username(), address);
            throw ex;
        }
    }

    @Operation(summary = "Exchange a refresh token for a new access token")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok("Token refreshed", authService.refresh(request.refreshToken())));
    }

    @Operation(summary = "Get the current authenticated member")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.ok(
                ApiResponse.ok(authService.currentUser(SecurityUtils.currentUsername())));
    }

    @Operation(summary = "Update the current member's profile")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated",
                authService.updateProfile(SecurityUtils.currentUsername(), request)));
    }
}
