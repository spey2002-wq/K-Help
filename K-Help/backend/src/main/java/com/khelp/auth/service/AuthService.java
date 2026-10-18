package com.khelp.auth.service;

import com.khelp.auth.dto.AuthResponse;
import com.khelp.auth.dto.LoginRequest;
import com.khelp.auth.dto.RegisterRequest;
import com.khelp.auth.dto.UpdateProfileRequest;
import com.khelp.auth.dto.UserResponse;
import com.khelp.auth.entity.Role;
import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.exception.ApiException;
import com.khelp.security.JwtProvider;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Registration, login, token refresh and profile management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw ApiException.conflict("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw ApiException.conflict("Email is already registered");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .nationality(request.nationality())
                .visaType(request.visaType())
                .preferredLanguage(
                        StringUtils.hasText(request.preferredLanguage())
                                ? request.preferredLanguage()
                                : "en")
                .role(Role.USER)
                .enabled(true)
                .suspended(false)
                .build();

        User saved = userRepository.save(user);
        log.info("Registered new user '{}' (id={})", saved.getUsername(), saved.getId());

        return issueTokens(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.username(), request.password()));
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userRepository.findByUsernameOrEmail(request.username(), request.username())
                .orElseThrow(() -> ApiException.notFound("User"));

        if (user.isSuspended()) {
            throw ApiException.forbidden("This account has been suspended. Contact an administrator.");
        }
        if (!user.isEnabled()) {
            throw ApiException.forbidden("This account is disabled.");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(String refreshToken) {
        if (!jwtProvider.isRefreshToken(refreshToken)) {
            throw ApiException.badRequest("Invalid refresh token");
        }

        Long userId = jwtProvider.getUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User"));

        if (user.isSuspended() || !user.isEnabled()) {
            throw ApiException.forbidden("This account is not allowed to sign in.");
        }

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public UserResponse currentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User"));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User"));

        if (StringUtils.hasText(request.email()) && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw ApiException.conflict("Email is already registered");
            }
            user.setEmail(request.email());
        }
        if (StringUtils.hasText(request.fullName())) {
            user.setFullName(request.fullName());
        }
        if (StringUtils.hasText(request.nationality())) {
            user.setNationality(request.nationality());
        }
        if (StringUtils.hasText(request.visaType())) {
            user.setVisaType(request.visaType());
        }
        if (StringUtils.hasText(request.preferredLanguage())) {
            user.setPreferredLanguage(request.preferredLanguage());
        }
        if (StringUtils.hasText(request.profileImageUrl())) {
            user.setProfileImageUrl(request.profileImageUrl());
        }
        if (request.bio() != null) {
            // An empty string clears the bio; null leaves it unchanged.
            user.setBio(request.bio().trim());
        }

        return UserResponse.from(userRepository.save(user));
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtProvider.generateAccessToken(
                user.getId(), user.getUsername(), user.getRole().name());
        String refreshToken = jwtProvider.generateRefreshToken(
                user.getId(), user.getUsername(), user.getRole().name());

        return AuthResponse.of(
                accessToken,
                refreshToken,
                jwtProvider.getAccessTokenValiditySeconds(),
                UserResponse.from(user));
    }
}
