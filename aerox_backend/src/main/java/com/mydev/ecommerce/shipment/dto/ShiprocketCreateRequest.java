package com.mydev.ecommerce.shipment.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ShiprocketCreateRequest(

        @Size(max = 100)
        String pickupLocation,

        @DecimalMin("0.50")
        @DecimalMax("1000.00")
        @Digits(integer = 4, fraction = 2)
        BigDecimal lengthCm,

        @DecimalMin("0.50")
        @DecimalMax("1000.00")
        @Digits(integer = 4, fraction = 2)
        BigDecimal breadthCm,

        @DecimalMin("0.50")
        @DecimalMax("1000.00")
        @Digits(integer = 4, fraction = 2)
        BigDecimal heightCm,

        @DecimalMin("0.01")
        @DecimalMax("1000.00")
        @Digits(integer = 4, fraction = 3)
        BigDecimal weightKg,

        Boolean assignAwb,

        @Positive
        Integer courierId,

        Boolean generatePickup
) {
}
