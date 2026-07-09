
package com.mydev.ecommerce.shipment.dto;

import java.time.OffsetDateTime;

public record ShiprocketOrderResponse(
        Long id,
        Long ecommerceOrderId,
        String ecommerceOrderNumber,
        Long shiprocketOrderId,
        Long shiprocketShipmentId,
        String awbCode,
        String courierName,
        String courierCompanyId,
        String trackingUrl,
        String status,
        String statusCode,
        String latestActivity,
        String latestLocation,
        OffsetDateTime lastTrackedAt,
        OffsetDateTime pickedUpAt,
        OffsetDateTime deliveredAt,
        OffsetDateTime expectedDeliveryAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}