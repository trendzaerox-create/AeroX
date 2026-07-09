

package com.mydev.ecommerce.payment.dto;

import jakarta.validation.constraints.NotNull;

public record CreateRazorpayOrderRequest(
        @NotNull Long addressId,
        String couponCode
) {
}