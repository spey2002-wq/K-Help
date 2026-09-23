package com.khelp.housing.repository;

import com.khelp.housing.entity.HousingInquiry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HousingInquiryRepository extends JpaRepository<HousingInquiry, Long> {

    List<HousingInquiry> findByInquirerIdOrderByCreatedAtDesc(Long inquirerId);

    List<HousingInquiry> findByHousingListingIdOrderByCreatedAtDesc(Long housingListingId);
}
