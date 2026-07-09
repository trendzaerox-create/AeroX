package com.mydev.ecommerce.coupon.controller;

import com.mydev.ecommerce.coupon.dto.ApplyCouponRequest;
import com.mydev.ecommerce.coupon.dto.ApplyCouponResponse;
import com.mydev.ecommerce.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/apply")
    public ResponseEntity<ApplyCouponResponse> apply(@RequestBody ApplyCouponRequest request) {
        return ResponseEntity.ok(
                couponService.previewCoupon(request.code(), request.cartTotal())
        );
    }
}