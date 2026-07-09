package com.mydev.ecommerce.guestcheckout.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GuestCartItemRequest(
        @NotNull Long productId,
        @Min(1) int quantity
) {
}