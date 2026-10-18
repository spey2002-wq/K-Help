package com.khelp.profile.controller;

import com.khelp.auth.dto.UserResponse;
import com.khelp.common.dto.ApiResponse;
import com.khelp.profile.dto.ExperienceRequest;
import com.khelp.profile.dto.ExperienceResponse;
import com.khelp.profile.dto.PhotoResponse;
import com.khelp.profile.dto.ProfileResponse;
import com.khelp.profile.dto.SkillsRequest;
import com.khelp.profile.entity.UserPhoto;
import com.khelp.profile.service.ProfileService;
import com.khelp.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * The signed-in member's own profile: skills, experiences, avatar and photos.
 * Basic fields (name, bio, nationality, visa) are edited through {@code PUT /api/auth/me}.
 */
@Tag(name = "Profile", description = "Member profile: skills, experiences and photos")
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Get my full profile")
    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> get() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.getProfile(me())));
    }

    // ---------------------------------------------------------------- skills --

    @Operation(summary = "Replace my skill list")
    @PutMapping("/skills")
    public ResponseEntity<ApiResponse<List<String>>> skills(@Valid @RequestBody SkillsRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok("Skills saved", profileService.replaceSkills(me(), request.skills())));
    }

    // ----------------------------------------------------------- experiences --

    @Operation(summary = "Add an experience")
    @PostMapping("/experiences")
    public ResponseEntity<ApiResponse<ExperienceResponse>> addExperience(
            @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Experience added", profileService.addExperience(me(), request)));
    }

    @Operation(summary = "Update one of my experiences")
    @PutMapping("/experiences/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> updateExperience(
            @PathVariable Long id, @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Experience updated",
                profileService.updateExperience(me(), id, request)));
    }

    @Operation(summary = "Delete one of my experiences")
    @DeleteMapping("/experiences/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        profileService.deleteExperience(me(), id);
        return ResponseEntity.ok(ApiResponse.ok("Experience deleted", null));
    }

    // ---------------------------------------------------------------- photos --

    @Operation(summary = "Upload or replace my profile picture")
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                ApiResponse.ok("Profile picture updated", profileService.uploadAvatar(me(), file)));
    }

    @Operation(summary = "Remove my profile picture")
    @DeleteMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> deleteAvatar() {
        return ResponseEntity.ok(
                ApiResponse.ok("Profile picture removed", profileService.deleteAvatar(me())));
    }

    @Operation(summary = "Add a photo to my gallery")
    @PostMapping(value = "/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PhotoResponse>> addPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Photo added", profileService.addPhoto(me(), file, caption)));
    }

    @Operation(summary = "Delete one of my photos")
    @DeleteMapping("/photos/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(@PathVariable Long id) {
        profileService.deletePhoto(me(), id);
        return ResponseEntity.ok(ApiResponse.ok("Photo deleted", null));
    }

    @Operation(summary = "Download one of my photos (requires sign-in)")
    @GetMapping("/photos/{id}/image")
    public ResponseEntity<byte[]> image(@PathVariable Long id) {
        UserPhoto photo = profileService.getPhoto(me(), id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.getContentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofHours(12)).cachePrivate())
                .body(photo.getData());
    }

    private static String me() {
        return SecurityUtils.currentUsername();
    }
}
