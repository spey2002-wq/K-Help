package com.khelp.housing.service;

import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.housing.dto.HousingInquiryRequest;
import com.khelp.housing.dto.HousingInquiryResponse;
import com.khelp.housing.dto.HousingListingRequest;
import com.khelp.housing.dto.HousingListingResponse;
import com.khelp.housing.dto.InquiryReplyRequest;
import com.khelp.housing.entity.HousingInquiry;
import com.khelp.housing.entity.HousingListing;
import com.khelp.housing.entity.InquiryStatus;
import com.khelp.housing.entity.PropertyStatus;
import com.khelp.housing.entity.PropertyType;
import com.khelp.housing.repository.HousingInquiryRepository;
import com.khelp.housing.repository.HousingListingRepository;
import com.khelp.security.SecurityUtils;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Housing finder: property listings, price/deposit/location filtering and inquiries.
 */
@Service
@RequiredArgsConstructor
public class HousingService {

    private final HousingListingRepository housingListingRepository;
    private final HousingInquiryRepository housingInquiryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<HousingListingResponse> search(
            String query,
            PropertyType propertyType,
            String city,
            String district,
            BigDecimal maxDeposit,
            BigDecimal maxRent,
            BigDecimal minArea,
            Boolean furnished,
            Boolean petFriendly,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<HousingListing> listings = housingListingRepository.search(
                query, propertyType, city, district, maxDeposit, maxRent, minArea,
                furnished, petFriendly, pageable);

        return PageResponse.from(listings.map(HousingListingResponse::summaryOf));
    }

    @Transactional
    public HousingListingResponse getById(Long id) {
        HousingListing listing = requireListing(id);

        if (listing.getStatus() != PropertyStatus.AVAILABLE && !isOwnerOrAdmin(listing)) {
            throw ApiException.notFound("Housing listing");
        }

        housingListingRepository.incrementViewCount(id);
        listing.setViewCount(listing.getViewCount() + 1);

        return HousingListingResponse.from(listing);
    }

    @Transactional
    public HousingListingResponse create(HousingListingRequest request) {
        User lister = requireCurrentUser();

        HousingListing listing = HousingListing.builder()
                .title(request.title())
                .description(request.description())
                .propertyType(request.propertyType())
                .city(request.city())
                .district(request.district())
                .neighborhood(request.neighborhood())
                .addressLine(request.addressLine())
                .depositAmount(request.depositAmount())
                .monthlyRent(request.monthlyRent())
                .maintenanceFee(request.maintenanceFee())
                .currency(StringUtils.hasText(request.currency()) ? request.currency() : "KRW")
                .areaSqm(request.areaSqm())
                .roomCount(request.roomCount())
                .bathroomCount(request.bathroomCount())
                .floorNumber(request.floorNumber())
                .availableFrom(request.availableFrom())
                .furnished(Boolean.TRUE.equals(request.furnished()))
                .petFriendly(Boolean.TRUE.equals(request.petFriendly()))
                .utilitiesIncluded(Boolean.TRUE.equals(request.utilitiesIncluded()))
                .imageUrls(request.imageUrls())
                .contactPhone(request.contactPhone())
                .contactEmail(request.contactEmail())
                .listedBy(lister)
                .status(SecurityUtils.hasRole("ADMIN")
                        ? PropertyStatus.AVAILABLE
                        : PropertyStatus.PENDING)
                .build();

        return HousingListingResponse.from(housingListingRepository.save(listing));
    }

    @Transactional
    public HousingListingResponse update(Long id, HousingListingRequest request) {
        HousingListing listing = requireListing(id);
        assertOwnerOrAdmin(listing);

        listing.setTitle(request.title());
        listing.setDescription(request.description());
        listing.setPropertyType(request.propertyType());
        listing.setCity(request.city());
        listing.setDistrict(request.district());
        listing.setNeighborhood(request.neighborhood());
        listing.setAddressLine(request.addressLine());
        listing.setDepositAmount(request.depositAmount());
        listing.setMonthlyRent(request.monthlyRent());
        listing.setMaintenanceFee(request.maintenanceFee());
        if (StringUtils.hasText(request.currency())) {
            listing.setCurrency(request.currency());
        }
        listing.setAreaSqm(request.areaSqm());
        listing.setRoomCount(request.roomCount());
        listing.setBathroomCount(request.bathroomCount());
        listing.setFloorNumber(request.floorNumber());
        listing.setAvailableFrom(request.availableFrom());
        if (request.furnished() != null) {
            listing.setFurnished(request.furnished());
        }
        if (request.petFriendly() != null) {
            listing.setPetFriendly(request.petFriendly());
        }
        if (request.utilitiesIncluded() != null) {
            listing.setUtilitiesIncluded(request.utilitiesIncluded());
        }
        listing.setImageUrls(request.imageUrls());
        listing.setContactPhone(request.contactPhone());
        listing.setContactEmail(request.contactEmail());

        return HousingListingResponse.from(housingListingRepository.save(listing));
    }

    @Transactional
    public void delete(Long id) {
        HousingListing listing = requireListing(id);
        assertOwnerOrAdmin(listing);

        listing.setStatus(PropertyStatus.RENTED);
        housingListingRepository.save(listing);
    }

    // ------------------------------------------------------------ inquiries

    @Transactional
    public HousingInquiryResponse createInquiry(Long listingId, HousingInquiryRequest request) {
        User inquirer = requireCurrentUser();
        HousingListing listing = requireListing(listingId);

        if (listing.getStatus() != PropertyStatus.AVAILABLE) {
            throw ApiException.badRequest("This property is not currently available");
        }
        if (listing.getListedBy().getId().equals(inquirer.getId())) {
            throw ApiException.badRequest("You cannot inquire about your own listing");
        }

        HousingInquiry inquiry = HousingInquiry.builder()
                .housingListing(listing)
                .inquirer(inquirer)
                .message(request.message())
                .contactPhone(request.contactPhone())
                .preferredMoveInDate(request.preferredMoveInDate())
                .status(InquiryStatus.NEW)
                .build();

        return HousingInquiryResponse.from(housingInquiryRepository.save(inquiry));
    }

    @Transactional(readOnly = true)
    public List<HousingInquiryResponse> myInquiries() {
        User inquirer = requireCurrentUser();
        return housingInquiryRepository.findByInquirerIdOrderByCreatedAtDesc(inquirer.getId())
                .stream()
                .map(HousingInquiryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HousingInquiryResponse> inquiriesForListing(Long listingId) {
        HousingListing listing = requireListing(listingId);
        assertOwnerOrAdmin(listing);

        return housingInquiryRepository.findByHousingListingIdOrderByCreatedAtDesc(listingId)
                .stream()
                .map(HousingInquiryResponse::from)
                .toList();
    }

    @Transactional
    public HousingInquiryResponse replyToInquiry(Long inquiryId, InquiryReplyRequest request) {
        HousingInquiry inquiry = housingInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> ApiException.notFound("Inquiry"));

        assertOwnerOrAdmin(inquiry.getHousingListing());

        inquiry.setStatus(request.status());
        inquiry.setOwnerReply(request.ownerReply());

        return HousingInquiryResponse.from(housingInquiryRepository.save(inquiry));
    }

    // -------------------------------------------------------------- helpers

    private HousingListing requireListing(Long id) {
        return housingListingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Housing listing"));
    }

    private User requireCurrentUser() {
        return userRepository.findByUsername(SecurityUtils.currentUsername())
                .orElseThrow(() -> ApiException.notFound("User"));
    }

    private boolean isOwnerOrAdmin(HousingListing listing) {
        String current = SecurityUtils.currentUsername();
        return (current != null && current.equals(listing.getListedBy().getUsername()))
                || SecurityUtils.hasRole("ADMIN");
    }

    private void assertOwnerOrAdmin(HousingListing listing) {
        if (!isOwnerOrAdmin(listing)) {
            throw ApiException.forbidden("You can only manage your own listings");
        }
    }
}
