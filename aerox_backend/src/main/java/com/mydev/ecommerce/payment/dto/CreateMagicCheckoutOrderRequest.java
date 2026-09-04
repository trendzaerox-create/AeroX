package com.mydev.ecommerce.payment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public record CreateMagicCheckoutOrderRequest(
        @NotEmpty List<@Valid Item> items
) {
    public record Item(
            @NotNull Long productId,
            @NotNull @Positive Integer quantity
    ) {}
}
