package com.mydev.ecommerce.bulkorder.dto;

import com.mydev.ecommerce.bulkorder.model.BulkOrderInquiryStatus;

import java.time.OffsetDateTime;

public record BulkOrderInquiryResponse(
        Long id,
        Long productId,
        String productTitle,
        String productImageUrl,
        Integer productPriceInr,
        String customerName,
        String email,
        String phone,
        String companyName,
        Integer quantity,
        String message,
        BulkOrderInquiryStatus status,
        OffsetDateTime createdAt
) {}