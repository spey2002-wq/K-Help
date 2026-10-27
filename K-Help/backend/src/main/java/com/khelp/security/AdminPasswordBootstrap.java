package com.khelp.security;

import com.khelp.auth.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Lets a deployment replace the well-known seed password of the administrator account.
 *
 * <p>The seed data ships an {@code admin} user with a documented development password. On a public
 * deployment set {@code APP_ADMIN_PASSWORD} (and optionally {@code APP_ADMIN_USERNAME}) and the
 * account is re-keyed with that value at every start. Nothing happens when it is not set, so local
 * development keeps working unchanged.
 */
@Slf4j
@Component
public class AdminPasswordBootstrap implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public AdminPasswordBootstrap(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:admin}") String adminUsername,
            @Value("${app.admin.password:}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(adminPassword)) {
            return;
        }
        if (adminPassword.length() < 10) {
            log.warn("APP_ADMIN_PASSWORD is shorter than 10 characters and was ignored");
            return;
        }
        userRepository.findByUsername(adminUsername).ifPresentOrElse(user -> {
            if (!passwordEncoder.matches(adminPassword, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(adminPassword));
                userRepository.save(user);
                log.info("Password of administrator '{}' was set from configuration", adminUsername);
            }
        }, () -> log.warn("Administrator '{}' not found; APP_ADMIN_PASSWORD ignored", adminUsername));
    }
}
