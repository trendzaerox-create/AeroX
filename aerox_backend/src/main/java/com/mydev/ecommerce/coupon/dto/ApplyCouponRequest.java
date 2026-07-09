package com.mydev.ecommerce.coupon.dto;

import java.math.BigDecimal;

public record ApplyCouponRequest(
        String code,
        BigDecimal cartTotal
) {
}