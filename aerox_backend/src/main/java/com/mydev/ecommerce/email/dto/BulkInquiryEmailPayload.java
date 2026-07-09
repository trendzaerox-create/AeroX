package com.mydev.ecommerce.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
@AllArgsConstructor
public class BulkInquiryEmailPayload {
    private final String customerName;
    private final String customerEmail;
    private final String phone;
    private final String companyName;
    private final Integer quantity;
    private final String message;
    private final String productTitle;
    private final String productImageUrl;
    private final Integer productPriceInr;
    private final OffsetDateTime createdAt;
}