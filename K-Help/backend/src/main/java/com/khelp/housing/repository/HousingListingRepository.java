package com.khelp.housing.repository;

import com.khelp.housing.entity.HousingListing;
import com.khelp.housing.entity.PropertyStatus;
import com.khelp.housing.entity.PropertyType;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HousingListingRepository extends JpaRepository<HousingListing, Long> {

    Page<HousingListing> findByStatus(PropertyStatus status, Pageable pageable);

    Page<HousingListing> findByListedById(Long listedById, Pageable pageable);

    /**
     * Property search with the price/deposit/location filters from the brief.
     * All parameters are optional; {@code null} disables that predicate.
     */
    @Query("""
            SELECT h FROM HousingListing h
            WHERE h.status = com.khelp.housing.entity.PropertyStatus.AVAILABLE
              AND (:query IS NULL OR :query = ''
                   OR LOWER(h.title) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(h.description) LIKE LOWER(CONCAT('%', :query, '%')))
              AND (:propertyType IS NULL OR h.propertyType = :propertyType)
              AND (:city IS NULL OR :city = '' OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')))
              AND (:district IS NULL OR :district = ''
                   OR LOWER(h.district) LIKE LOWER(CONCAT('%', :district, '%')))
              AND (:maxDeposit IS NULL OR h.depositAmount IS NULL OR h.depositAmount <= :maxDeposit)
              AND (:maxRent IS NULL OR h.monthlyRent IS NULL OR h.monthlyRent <= :maxRent)
              AND (:minArea IS NULL OR h.areaSqm IS NULL OR h.areaSqm >= :minArea)
              AND (:furnished IS NULL OR h.furnished = :furnished)
              AND (:petFriendly IS NULL OR h.petFriendly = :petFriendly)
            """)
    Page<HousingListing> search(
            @Param("query") String query,
            @Param("propertyType") PropertyType propertyType,
            @Param("city") String city,
            @Param("district") String district,
            @Param("maxDeposit") BigDecimal maxDeposit,
            @Param("maxRent") BigDecimal maxRent,
            @Param("minArea") BigDecimal minArea,
            @Param("furnished") Boolean furnished,
            @Param("petFriendly") Boolean petFriendly,
            Pageable pageable);

    @Modifying
    @Query("UPDATE HousingListing h SET h.viewCount = h.viewCount + 1 WHERE h.id = :id")
    void incrementViewCount(@Param("id") Long id);

    long countByStatus(PropertyStatus status);
}
