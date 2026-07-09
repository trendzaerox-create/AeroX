package com.mydev.ecommerce.order.dto;

import java.time.OffsetDateTime;

public record ShipmentResponse(
        Long id,
        String courierName,
        String trackingId,
        String trackingUrl,
        OffsetDateTime shippedAt,
        OffsetDateTime updatedAt
) {
}