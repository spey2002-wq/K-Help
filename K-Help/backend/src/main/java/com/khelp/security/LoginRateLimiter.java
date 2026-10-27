package com.khelp.security;

import com.khelp.common.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Slows down password guessing on {@code /api/auth/login}.
 *
 * <p>Only <em>failed</em> attempts are counted, so many people signing in correctly with the
 * shared demo account never lock each other out. After too many failures for the same username
 * from the same address (or too many from one address overall) further attempts are answered
 * with HTTP 429 until the window passes. A successful sign-in clears the username counter.
 *
 * <p>State is kept in memory, which is enough for a single backend instance.
 */
@Component
public class LoginRateLimiter {

    private final int maxFailuresPerAccount;
    private final int maxFailuresPerAddress;
    private final long windowMs;

    private final ConcurrentMap<String, Deque<Long>> failures = new ConcurrentHashMap<>();

    public LoginRateLimiter(
            @Value("${app.security.login-max-failures:5}") int maxFailuresPerAccount,
            @Value("${app.security.login-max-failures-per-ip:30}") int maxFailuresPerAddress,
            @Value("${app.security.login-window-minutes:15}") long windowMinutes) {
        this.maxFailuresPerAccount = maxFailuresPerAccount;
        this.maxFailuresPerAddress = maxFailuresPerAddress;
        this.windowMs = Duration.ofMinutes(windowMinutes).toMillis();
    }

    /** Throws HTTP 429 when this caller has already failed too often. */
    public void checkAllowed(String username, String address) {
        if (count(accountKey(username, address)) >= maxFailuresPerAccount
                || count(addressKey(address)) >= maxFailuresPerAddress) {
            throw new ApiException(
                    "Too many failed sign-in attempts. Please wait a few minutes and try again.",
                    HttpStatus.TOO_MANY_REQUESTS);
        }
    }

    public void recordFailure(String username, String address) {
        record(accountKey(username, address));
        record(addressKey(address));
    }

    public void recordSuccess(String username, String address) {
        failures.remove(accountKey(username, address));
    }

    /**
     * Address of the caller. Behind a proxy such as Render the last {@code X-Forwarded-For}
     * entry is the one the proxy itself added, so earlier (client-supplied) entries are ignored.
     */
    public static String clientAddress(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            String[] parts = forwarded.split(",");
            return parts[parts.length - 1].trim();
        }
        return request.getRemoteAddr();
    }

    // ------------------------------------------------------------------ internals

    private static String accountKey(String username, String address) {
        return "u:" + (username == null ? "" : username.trim().toLowerCase(Locale.ROOT)) + "|" + address;
    }

    private static String addressKey(String address) {
        return "ip:" + address;
    }

    private int count(String key) {
        Deque<Long> times = failures.get(key);
        if (times == null) {
            return 0;
        }
        synchronized (times) {
            prune(times);
            return times.size();
        }
    }

    private void record(String key) {
        Deque<Long> times = failures.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (times) {
            prune(times);
            times.addLast(System.currentTimeMillis());
        }
        if (failures.size() > 10_000) {
            failures.entrySet().removeIf(e -> {
                synchronized (e.getValue()) {
                    prune(e.getValue());
                    return e.getValue().isEmpty();
                }
            });
        }
    }

    private void prune(Deque<Long> times) {
        long cutoff = System.currentTimeMillis() - windowMs;
        while (!times.isEmpty() && times.peekFirst() < cutoff) {
            times.pollFirst();
        }
    }
}
