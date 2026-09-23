package com.khelp.info.service;

import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.info.dto.GuideRequest;
import com.khelp.info.dto.GuideResponse;
import com.khelp.info.entity.Guide;
import com.khelp.info.entity.GuideCategory;
import com.khelp.info.repository.GuideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Korea living guide catalogue, backed by Redis caching for hot list queries.
 */
@Service
@RequiredArgsConstructor
public class GuideService {

    private final GuideRepository guideRepository;

    @Cacheable(
            value = "guides",
            key = "#category + ':' + #language + ':' + #query + ':' + #page + ':' + #size")
    @Transactional(readOnly = true)
    public PageResponse<GuideResponse> search(
            GuideCategory category, String language, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));

        Page<Guide> guides = guideRepository.search(
                category,
                StringUtils.hasText(language) ? language : null,
                query,
                pageable);

        return PageResponse.from(guides.map(GuideResponse::summaryOf));
    }

    @Transactional
    public GuideResponse getById(Long id) {
        Guide guide = guideRepository.findById(id)
                .filter(Guide::isPublished)
                .orElseThrow(() -> ApiException.notFound("Guide"));

        guideRepository.incrementViewCount(id);
        guide.setViewCount(guide.getViewCount() + 1);

        return GuideResponse.from(guide);
    }

    @CacheEvict(value = "guides", allEntries = true)
    @Transactional
    public GuideResponse create(GuideRequest request) {
        Guide guide = Guide.builder()
                .title(request.title())
                .summary(request.summary())
                .content(request.content())
                .category(request.category())
                .languageCode(StringUtils.hasText(request.languageCode()) ? request.languageCode() : "en")
                .sourceUrl(request.sourceUrl())
                .published(request.published() == null || request.published())
                .build();

        return GuideResponse.from(guideRepository.save(guide));
    }

    @CacheEvict(value = "guides", allEntries = true)
    @Transactional
    public GuideResponse update(Long id, GuideRequest request) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Guide"));

        guide.setTitle(request.title());
        guide.setSummary(request.summary());
        guide.setContent(request.content());
        guide.setCategory(request.category());
        if (StringUtils.hasText(request.languageCode())) {
            guide.setLanguageCode(request.languageCode());
        }
        guide.setSourceUrl(request.sourceUrl());
        if (request.published() != null) {
            guide.setPublished(request.published());
        }

        return GuideResponse.from(guideRepository.save(guide));
    }

    @CacheEvict(value = "guides", allEntries = true)
    @Transactional
    public void delete(Long id) {
        Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Guide"));
        guide.setPublished(false);
        guideRepository.save(guide);
    }
}
