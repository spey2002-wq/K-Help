package com.khelp.profile.repository;

import com.khelp.profile.entity.PhotoKind;
import com.khelp.profile.entity.UserPhoto;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPhotoRepository extends JpaRepository<UserPhoto, Long> {

    /** Metadata-only projection so listing photos never loads the image bytes. */
    interface PhotoMeta {
        Long getId();

        String getCaption();

        Instant getCreatedAt();
    }

    List<PhotoMeta> findByUserIdAndKindOrderByCreatedAtDesc(Long userId, PhotoKind kind);

    Optional<UserPhoto> findByIdAndUserId(Long id, Long userId);

    long countByUserIdAndKind(Long userId, PhotoKind kind);

    void deleteByUserIdAndKind(Long userId, PhotoKind kind);
}
