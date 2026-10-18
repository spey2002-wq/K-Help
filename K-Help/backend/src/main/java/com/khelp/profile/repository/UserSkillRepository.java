package com.khelp.profile.repository;

import com.khelp.profile.entity.UserSkill;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUserIdOrderByNameAsc(Long userId);

    void deleteByUserId(Long userId);
}
