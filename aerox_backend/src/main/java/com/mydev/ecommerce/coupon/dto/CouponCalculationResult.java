package com.mydev.ecommerce.coupon.dto;

import com.mydev.ecommerce.coupon.model.Coupon;

import java.math.BigDecimal;

public record CouponCalculationResult(
        Coupon coupon,
        BigDecimal discountAmount,
        BigDecimal finalTotal
) {
}