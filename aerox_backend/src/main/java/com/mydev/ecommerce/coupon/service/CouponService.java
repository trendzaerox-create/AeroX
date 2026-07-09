package com.mydev.ecommerce.coupon.service;

import com.mydev.ecommerce.coupon.dto.ApplyCouponResponse;
import com.mydev.ecommerce.coupon.dto.CouponCalculationResult;
import com.mydev.ecommerce.coupon.model.Coupon;
import com.mydev.ecommerce.coupon.model.CouponUsage;
import com.mydev.ecommerce.coupon.model.DiscountType;
import com.mydev.ecommerce.coupon.repository.CouponRepository;
import com.mydev.ecommerce.coupon.repository.CouponUsageRepository;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Transactional(readOnly = true)
    public ApplyCouponResponse previewCoupon(String code, BigDecimal cartTotal) {
        CouponCalculationResult result = validateAndCalculate(code, cartTotal);

        return new ApplyCouponResponse(
                true,
                result.coupon().getCode(),
                result.discountAmount(),
                result.finalTotal(),
                "Coupon applied successfully"
        );
    }

    @Transactional(readOnly = true)
    public CouponCalculationResult validateAndCalculate(String code, BigDecimal cartTotal) {
        if (code == null || code.isBlank()) {
            throw new RuntimeException("Coupon code is required");
        }

        if (cartTotal == null || cartTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Cart total must be greater than zero");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

        OffsetDateTime now = OffsetDateTime.now();

        if (!Boolean.TRUE.equals(coupon.getActive())) {
            throw new RuntimeException("Coupon is inactive");
        }

        if (coupon.getStartsAt() != null && now.isBefore(coupon.getStartsAt())) {
            throw new RuntimeException("Coupon not started yet");
        }

        if (coupon.getEndsAt() != null && now.isAfter(coupon.getEndsAt())) {
            throw new RuntimeException("Coupon expired");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit reached");
        }

        if (coupon.getMinOrderValue() != null && cartTotal.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new RuntimeException("Minimum cart value not met for this coupon");
        }

        BigDecimal discount = BigDecimal.ZERO;

        if (coupon.getDiscountType() == DiscountType.FLAT) {
            discount = coupon.getDiscountValue();
        } else if (coupon.getDiscountType() == DiscountType.PERCENT) {
            discount = cartTotal
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }

        if (discount.compareTo(cartTotal) > 0) {
            discount = cartTotal;
        }

        BigDecimal finalTotal = cartTotal.subtract(discount);

        return new CouponCalculationResult(coupon, discount, finalTotal);
    }

    public void consumeCoupon(Coupon coupon, User user, Order order) {
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOrder(order);

        couponUsageRepository.save(usage);
    }
}