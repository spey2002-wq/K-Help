package com.khelp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * Creates and validates HS256 JSON Web Tokens for the K-Help platform.
 *
 * <p>Access tokens carry the user id, username and role so the API can authorize
 * requests without hitting the database on every call.
 */
@Slf4j
@Component
public class JwtProvider {

    private static final String CLAIM_USER_ID = "uid";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "typ";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";

    private final String secret;
    private final long accessTokenValidityMs;
    private final long refreshTokenValidityMs;

    private SecretKey signingKey;

    public JwtProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-validity-ms:900000}") long accessTokenValidityMs,
            @Value("${app.jwt.refresh-token-validity-ms:604800000}") long refreshTokenValidityMs) {
        this.secret = secret;
        this.accessTokenValidityMs = accessTokenValidityMs;
        this.refreshTokenValidityMs = refreshTokenValidityMs;
    }

    @PostConstruct
    void init() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret must be at least 32 bytes for HS256 signing");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long userId, String username, String role) {
        return buildToken(userId, username, role, TYPE_ACCESS, accessTokenValidityMs);
    }

    public String generateRefreshToken(Long userId, String username, String role) {
        return buildToken(userId, username, role, TYPE_REFRESH, refreshTokenValidityMs);
    }

    private String buildToken(Long userId, String username, String role, String type, long validityMs) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username)
                .claims(Map.of(
                        CLAIM_USER_ID, userId,
                        CLAIM_ROLE, role,
                        CLAIM_TYPE, type))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(validityMs)))
                .signWith(signingKey)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return TYPE_ACCESS.equals(claims.get(CLAIM_TYPE, String.class))
                    && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Rejected JWT: {}", ex.getMessage());
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            return TYPE_REFRESH.equals(parseClaims(token).get(CLAIM_TYPE, String.class));
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public Long getUserId(String token) {
        return parseClaims(token).get(CLAIM_USER_ID, Number.class).longValue();
    }

    public List<SimpleGrantedAuthority> getAuthorities(String token) {
        String role = parseClaims(token).get(CLAIM_ROLE, String.class);
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public long getAccessTokenValiditySeconds() {
        return accessTokenValidityMs / 1000;
    }
}
