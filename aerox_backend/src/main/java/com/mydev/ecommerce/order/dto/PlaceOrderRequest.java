


package com.mydev.ecommerce.order.dto;

import jakarta.validation.constraints.NotNull;

public record PlaceOrderRequest(
        @NotNull Long addressId,
        @NotNull String paymentMethod,
        String couponCode
) {
}