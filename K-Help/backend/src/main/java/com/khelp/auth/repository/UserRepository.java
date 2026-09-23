package com.khelp.auth.repository;

import com.khelp.auth.entity.Role;
import com.khelp.auth.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findByRole(Role role, Pageable pageable);

    long countBySuspendedTrue();

    @Query("""
            SELECT u FROM User u
            WHERE :query IS NULL OR :query = ''
               OR LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(COALESCE(u.fullName, '')) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<User> search(@Param("query") String query, Pageable pageable);
}
