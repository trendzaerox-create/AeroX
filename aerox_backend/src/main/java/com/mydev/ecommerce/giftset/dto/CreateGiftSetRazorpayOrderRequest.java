package com.mydev.ecommerce.giftset.dto;

import jakarta.validation.constraints.NotNull;

public record CreateGiftSetRazorpayOrderRequest(
        @NotNull Long addressId,
        String couponCode
) {
}