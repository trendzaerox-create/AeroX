package com.mydev.ecommerce.coupon.dto;

import java.math.BigDecimal;

public record ApplyCouponResponse(
        boolean valid,
        String code,
        BigDecimal discountAmount,
        BigDecimal finalTotal,
        String message
) {
}