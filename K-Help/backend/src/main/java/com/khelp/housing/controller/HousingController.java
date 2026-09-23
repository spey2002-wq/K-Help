package com.khelp.housing.controller;

import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import com.khelp.housing.dto.HousingInquiryRequest;
import com.khelp.housing.dto.HousingInquiryResponse;
import com.khelp.housing.dto.HousingListingRequest;
import com.khelp.housing.dto.HousingListingResponse;
import com.khelp.housing.dto.InquiryReplyRequest;
import com.khelp.housing.entity.PropertyType;
import com.khelp.housing.service.HousingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

/**
 * Housing finder: room listings, price/deposit/location filters and inquiries.
 */
@Tag(name = "Housing", description = "Property listings, filtering and inquiries")
@RestController
@RequestMapping("/api/housing")
@RequiredArgsConstructor
public class HousingController {

    private final HousingService housingService;

    @Operation(summary = "Search available properties with filters")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<HousingListingResponse>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) BigDecimal maxDeposit,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) BigDecimal minArea,
            @RequestParam(required = false) Boolean furnished,
            @RequestParam(required = false) Boolean petFriendly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(housingService.search(
                q, propertyType, city, district, maxDeposit, maxRent, minArea,
                furnished, petFriendly, page, size)));
    }

    @Operation(summary = "Get a housing listing by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HousingListingResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(housingService.getById(id)));
    }

    @Operation(summary = "Create a housing listing (awaits admin approval)")
    @PostMapping
    public ResponseEntity<ApiResponse<HousingListingResponse>> create(
            @Valid @RequestBody HousingListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Housing listing submitted for approval",
                        housingService.create(request)));
    }

    @Operation(summary = "Update a housing listing you posted")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HousingListingResponse>> update(
            @PathVariable Long id, @Valid @RequestBody HousingListingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Housing listing updated",
                housingService.update(id, request)));
    }

    @Operation(summary = "Mark a housing listing you posted as rented")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        housingService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Housing listing marked as rented", null));
    }

    @Operation(summary = "Send an inquiry about a property")
    @PostMapping("/{id}/inquiries")
    public ResponseEntity<ApiResponse<HousingInquiryResponse>> inquire(
            @PathVariable Long id, @Valid @RequestBody HousingInquiryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Inquiry sent", housingService.createInquiry(id, request)));
    }

    @Operation(summary = "List inquiries for a property you posted")
    @GetMapping("/{id}/inquiries")
    public ResponseEntity<ApiResponse<List<HousingInquiryResponse>>> inquiries(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(housingService.inquiriesForListing(id)));
    }

    @Operation(summary = "List the current member's property inquiries")
    @GetMapping("/inquiries/me")
    public ResponseEntity<ApiResponse<List<HousingInquiryResponse>>> myInquiries() {
        return ResponseEntity.ok(ApiResponse.ok(housingService.myInquiries()));
    }

    @Operation(summary = "Reply to an inquiry (listing owner or admin)")
    @PutMapping("/inquiries/{inquiryId}")
    public ResponseEntity<ApiResponse<HousingInquiryResponse>> reply(
            @PathVariable Long inquiryId, @Valid @RequestBody InquiryReplyRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Inquiry updated",
                housingService.replyToInquiry(inquiryId, request)));
    }
}
