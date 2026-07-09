package com.mydev.ecommerce.bulkorder.repository;

import com.mydev.ecommerce.bulkorder.model.BulkOrderInquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BulkOrderInquiryRepository extends JpaRepository<BulkOrderInquiry, Long> {
    List<BulkOrderInquiry> findAllByOrderByCreatedAtDesc();
}