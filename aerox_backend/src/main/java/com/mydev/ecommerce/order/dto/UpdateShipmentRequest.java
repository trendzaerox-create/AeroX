package com.mydev.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateShipmentRequest(

        @NotBlank(
                message = "Courier name is required"
        )
        @Size(
                max = 100,
                message = "Courier name cannot exceed 100 characters"
        )
        String courierName,

        @NotBlank(
                message = "Tracking ID / AWB is required"
        )
        @Size(
                max = 150,
                message = "Tracking ID cannot exceed 150 characters"
        )
        String trackingId,

        @Size(
                max = 500,
                message = "Tracking URL cannot exceed 500 characters"
        )
        String trackingUrl
) {
}