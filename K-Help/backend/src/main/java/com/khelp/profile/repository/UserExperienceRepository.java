package com.khelp.profile.repository;

import com.khelp.profile.entity.UserExperience;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserExperienceRepository extends JpaRepository<UserExperience, Long> {

    /** Current entries first, then most recently started. */
    @Query("""
            SELECT e FROM UserExperience e
            WHERE e.userId = :userId
            ORDER BY e.current DESC, e.startDate DESC NULLS LAST, e.id DESC
            """)
    List<UserExperience> findAllForUser(@Param("userId") Long userId);

    Optional<UserExperience> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}
