package com.khelp.profile.service;

import com.khelp.auth.dto.UserResponse;
import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.exception.ApiException;
import com.khelp.profile.dto.ExperienceRequest;
import com.khelp.profile.dto.ExperienceResponse;
import com.khelp.profile.dto.PhotoResponse;
import com.khelp.profile.dto.ProfileResponse;
import com.khelp.profile.entity.ExperienceKind;
import com.khelp.profile.entity.PhotoKind;
import com.khelp.profile.entity.UserExperience;
import com.khelp.profile.entity.UserPhoto;
import com.khelp.profile.entity.UserSkill;
import com.khelp.profile.repository.UserExperienceRepository;
import com.khelp.profile.repository.UserPhotoRepository;
import com.khelp.profile.repository.UserSkillRepository;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Member profile content: skills, experience timeline, avatar and photo gallery.
 */
@Service
@RequiredArgsConstructor
public class ProfileService {

    static final int MAX_SKILLS = 20;
    static final int MAX_SKILL_LENGTH = 40;
    static final int MAX_EXPERIENCES = 30;
    static final int MAX_GALLERY_PHOTOS = 12;
    static final int MAX_IMAGE_BYTES = 5 * 1024 * 1024;

    private final UserRepository userRepository;
    private final UserSkillRepository skillRepository;
    private final UserExperienceRepository experienceRepository;
    private final UserPhotoRepository photoRepository;

    // ------------------------------------------------------------- overview --

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String username) {
        User user = requireUser(username);
        return new ProfileResponse(
                UserResponse.from(user),
                skillRepository.findByUserIdOrderByNameAsc(user.getId()).stream()
                        .map(UserSkill::getName).toList(),
                experienceRepository.findAllForUser(user.getId()).stream()
                        .map(ExperienceResponse::from).toList(),
                photoRepository.findByUserIdAndKindOrderByCreatedAtDesc(user.getId(), PhotoKind.GALLERY)
                        .stream().map(PhotoResponse::from).toList());
    }

    // --------------------------------------------------------------- skills --

    @Transactional
    public List<String> replaceSkills(String username, List<String> requested) {
        User user = requireUser(username);

        // Trim, collapse whitespace, drop blanks and case-insensitive duplicates (first spelling wins).
        Map<String, String> unique = new LinkedHashMap<>();
        for (String raw : requested) {
            if (raw == null) {
                continue;
            }
            String name = raw.trim().replaceAll("\\s+", " ");
            if (name.isEmpty()) {
                continue;
            }
            if (name.length() > MAX_SKILL_LENGTH) {
                throw ApiException.badRequest(
                        "Each skill must be at most " + MAX_SKILL_LENGTH + " characters");
            }
            unique.putIfAbsent(name.toLowerCase(Locale.ROOT), name);
        }
        if (unique.size() > MAX_SKILLS) {
            throw ApiException.badRequest("You can add up to " + MAX_SKILLS + " skills");
        }

        skillRepository.deleteByUserId(user.getId());
        skillRepository.flush();
        List<UserSkill> saved = skillRepository.saveAll(unique.values().stream()
                .map(name -> UserSkill.builder().userId(user.getId()).name(name).build())
                .toList());
        return saved.stream().map(UserSkill::getName).sorted(String.CASE_INSENSITIVE_ORDER).toList();
    }

    // ----------------------------------------------------------- experiences --

    @Transactional
    public ExperienceResponse addExperience(String username, ExperienceRequest request) {
        User user = requireUser(username);
        if (experienceRepository.countByUserId(user.getId()) >= MAX_EXPERIENCES) {
            throw ApiException.badRequest("You can add up to " + MAX_EXPERIENCES + " experiences");
        }
        UserExperience experience = UserExperience.builder().userId(user.getId()).build();
        apply(experience, request);
        return ExperienceResponse.from(experienceRepository.save(experience));
    }

    @Transactional
    public ExperienceResponse updateExperience(String username, Long id, ExperienceRequest request) {
        User user = requireUser(username);
        UserExperience experience = experienceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Experience"));
        apply(experience, request);
        return ExperienceResponse.from(experienceRepository.save(experience));
    }

    @Transactional
    public void deleteExperience(String username, Long id) {
        User user = requireUser(username);
        UserExperience experience = experienceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Experience"));
        experienceRepository.delete(experience);
    }

    private void apply(UserExperience experience, ExperienceRequest request) {
        boolean current = Boolean.TRUE.equals(request.current());
        if (!current && request.startDate() != null && request.endDate() != null
                && request.endDate().isBefore(request.startDate())) {
            throw ApiException.badRequest("End date cannot be before the start date");
        }
        experience.setKind(request.kind() != null ? request.kind() : ExperienceKind.WORK);
        experience.setTitle(request.title().trim());
        experience.setOrganization(blankToNull(request.organization()));
        experience.setLocation(blankToNull(request.location()));
        experience.setStartDate(request.startDate());
        experience.setCurrent(current);
        experience.setEndDate(current ? null : request.endDate());
        experience.setDescription(blankToNull(request.description()));
    }

    // --------------------------------------------------------------- photos --

    @Transactional
    public UserResponse uploadAvatar(String username, MultipartFile file) {
        User user = requireUser(username);
        StoredImage image = readImage(file);

        photoRepository.deleteByUserIdAndKind(user.getId(), PhotoKind.AVATAR);
        photoRepository.flush();

        UserPhoto avatar = photoRepository.save(UserPhoto.builder()
                .userId(user.getId())
                .kind(PhotoKind.AVATAR)
                .contentType(image.contentType())
                .sizeBytes(image.bytes().length)
                .data(image.bytes())
                .build());

        user.setProfileImageUrl(PhotoResponse.urlFor(avatar.getId()));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse deleteAvatar(String username) {
        User user = requireUser(username);
        photoRepository.deleteByUserIdAndKind(user.getId(), PhotoKind.AVATAR);
        user.setProfileImageUrl(null);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public PhotoResponse addPhoto(String username, MultipartFile file, String caption) {
        User user = requireUser(username);
        if (photoRepository.countByUserIdAndKind(user.getId(), PhotoKind.GALLERY) >= MAX_GALLERY_PHOTOS) {
            throw ApiException.badRequest("You can upload up to " + MAX_GALLERY_PHOTOS + " photos");
        }
        StoredImage image = readImage(file);
        String cleanCaption = blankToNull(caption);
        if (cleanCaption != null && cleanCaption.length() > 200) {
            throw ApiException.badRequest("Caption must be at most 200 characters");
        }

        UserPhoto photo = photoRepository.save(UserPhoto.builder()
                .userId(user.getId())
                .kind(PhotoKind.GALLERY)
                .contentType(image.contentType())
                .sizeBytes(image.bytes().length)
                .caption(cleanCaption)
                .data(image.bytes())
                .build());
        return PhotoResponse.from(photo);
    }

    @Transactional
    public void deletePhoto(String username, Long id) {
        User user = requireUser(username);
        UserPhoto photo = photoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Photo"));
        if (photo.getKind() == PhotoKind.AVATAR) {
            user.setProfileImageUrl(null);
            userRepository.save(user);
        }
        photoRepository.delete(photo);
    }

    @Transactional(readOnly = true)
    public UserPhoto getPhoto(String username, Long id) {
        User user = requireUser(username);
        return photoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Photo"));
    }

    // -------------------------------------------------------------- helpers --

    private User requireUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User"));
    }

    private static String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private record StoredImage(byte[] bytes, String contentType) {
    }

    /**
     * Reads an upload and decides its type from the file signature, not from the
     * client-supplied content type, so only genuine images are ever stored and served.
     */
    private StoredImage readImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("Please choose an image file");
        }
        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new ApiException("Image is too large (max 5 MB)",
                    org.springframework.http.HttpStatus.PAYLOAD_TOO_LARGE);
        }
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw ApiException.badRequest("Could not read the uploaded file");
        }
        String type = sniffImageType(bytes);
        if (type == null) {
            throw ApiException.badRequest("Only JPEG, PNG, WebP or GIF images are allowed");
        }
        return new StoredImage(bytes, type);
    }

    static String sniffImageType(byte[] b) {
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') {
            return "image/png";
        }
        if (b.length >= 6 && b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8') {
            return "image/gif";
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return "image/webp";
        }
        return null;
    }
}
