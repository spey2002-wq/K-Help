package com.khelp.profile.dto;

import com.khelp.profile.entity.UserPhoto;
import com.khelp.profile.repository.UserPhotoRepository.PhotoMeta;
import java.time.Instant;

/** Gallery photo metadata; the image itself is fetched from {@code url}. */
public record PhotoResponse(Long id, String caption, String url, Instant createdAt) {

    public static String urlFor(Long id) {
        return "/api/profile/photos/" + id + "/image";
    }

    public static PhotoResponse from(UserPhoto photo) {
        return new PhotoResponse(
                photo.getId(), photo.getCaption(), urlFor(photo.getId()), photo.getCreatedAt());
    }

    public static PhotoResponse from(PhotoMeta meta) {
        return new PhotoResponse(
                meta.getId(), meta.getCaption(), urlFor(meta.getId()), meta.getCreatedAt());
    }
}
