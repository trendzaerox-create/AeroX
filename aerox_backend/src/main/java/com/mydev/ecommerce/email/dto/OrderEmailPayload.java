package com.mydev.ecommerce.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class OrderEmailPayload {

    private final String customerName;
    private final String customerEmail;
    private final String orderNumber;
    private final String orderStatus;
    private final String paymentMethod;
    private final String paymentStatus;
    private final BigDecimal subtotalAmount;
    private final BigDecimal shippingAmount;
    private final BigDecimal discountAmount;
    private final BigDecimal totalAmount;
    private final String couponCode;
    private final String addressFullName;
    private final String addressPhone;
    private final String addressLine1;
    private final String addressLine2;
    private final String addressCity;
    private final String addressState;
    private final String addressPincode;
    private final String addressCountry;
    private final OffsetDateTime createdAt;
    private final List<OrderEmailItemPayload> items;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class OrderEmailItemPayload {
        private final String productTitle;
        private final Integer quantity;
        private final BigDecimal unitPrice;
        private final BigDecimal lineTotal;
        private final String imageUrl;
    }
}