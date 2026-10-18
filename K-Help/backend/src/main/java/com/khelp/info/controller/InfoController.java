package com.khelp.info.controller;

import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import com.khelp.info.dto.GuideRequest;
import com.khelp.info.dto.GuideResponse;
import com.khelp.info.entity.GuideCategory;
import com.khelp.info.service.GuideService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Korea living guides: visa, healthcare, banking, housing, emergency and more.
 */
@Tag(name = "Info", description = "Curated Korea living guides")
@RestController
@RequestMapping("/api/guides")
@RequiredArgsConstructor
public class InfoController {

    private final GuideService guideService;

    @Operation(summary = "Search guides by category, country, language and keyword")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<GuideResponse>>> list(
            @RequestParam(required = false) GuideCategory category,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                ApiResponse.ok(guideService.search(category, language, country, q, page, size)));
    }

    @Operation(summary = "List countries that have visa/country guides")
    @GetMapping("/countries")
    public ResponseEntity<ApiResponse<List<String>>> countries() {
        return ResponseEntity.ok(ApiResponse.ok(guideService.countries()));
    }

    @Operation(summary = "Get a full guide article")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GuideResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(guideService.getById(id)));
    }

    @Operation(summary = "Create a guide (admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<GuideResponse>> create(
            @Valid @RequestBody GuideRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Guide created", guideService.create(request)));
    }

    @Operation(summary = "Update a guide (admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GuideResponse>> update(
            @PathVariable Long id, @Valid @RequestBody GuideRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Guide updated", guideService.update(id, request)));
    }

    @Operation(summary = "Unpublish a guide (admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        guideService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Guide unpublished", null));
    }
}
