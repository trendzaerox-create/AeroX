package com.mydev.ecommerce.giftset.dto;

import jakarta.validation.constraints.NotNull;

public record PlaceGiftSetOrderRequest(
        @NotNull Long addressId,
        @NotNull String paymentMethod,
        String couponCode
) {
}