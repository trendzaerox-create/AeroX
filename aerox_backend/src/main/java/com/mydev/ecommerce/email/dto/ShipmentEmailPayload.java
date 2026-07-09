package com.mydev.ecommerce.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ShipmentEmailPayload {

    private final Long orderId;

    private final String orderNumber;

    private final String customerName;

    private final String customerEmail;

    private final BigDecimal totalAmount;

    private final String courierName;

    private final String trackingId;

    private final String trackingUrl;

    private final OffsetDateTime shippedAt;
}