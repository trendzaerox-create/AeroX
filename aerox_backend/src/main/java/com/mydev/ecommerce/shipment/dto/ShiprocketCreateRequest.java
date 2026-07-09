package com.mydev.ecommerce.shipment.dto;

import java.math.BigDecimal;

public record ShiprocketCreateRequest(

        /*
         * Optional. If blank/null, app.shiprocket.pickup-location is used.
         */
        String pickupLocation,

        /*
         * Optional package values. If null, defaults from application.yml are used.
         */
        BigDecimal lengthCm,

        BigDecimal breadthCm,

        BigDecimal heightCm,

        BigDecimal weightKg,

        /*
         * Recommended true. Creates AWB immediately after Shiprocket order creation.
         */
        Boolean assignAwb,

        /*
         * Optional. If null, Shiprocket can auto-assign based on your settings.
         */
        Integer courierId,

        /*
         * Optional. Keep false at first. After testing, set true if you want
         * pickup generation in the same admin click.
         */
        Boolean generatePickup
) {
}
