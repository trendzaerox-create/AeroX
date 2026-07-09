package com.mydev.ecommerce.order.event;

import com.mydev.ecommerce.email.dto.ShipmentEmailPayload;

public record ShipmentUpdatedEvent(
        ShipmentEmailPayload payload
) {
}