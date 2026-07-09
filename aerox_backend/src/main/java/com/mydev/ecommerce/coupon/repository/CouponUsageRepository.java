package com.mydev.ecommerce.coupon.repository;

import com.mydev.ecommerce.coupon.model.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
}