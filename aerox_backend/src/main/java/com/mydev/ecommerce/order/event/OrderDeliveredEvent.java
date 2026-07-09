package com.mydev.ecommerce.order.event;

import com.mydev.ecommerce.email.dto.DeliveredEmailPayload;

public record OrderDeliveredEvent(
        DeliveredEmailPayload payload
) {
}