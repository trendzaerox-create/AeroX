package com.mydev.ecommerce.auth.repository;

import com.mydev.ecommerce.auth.model.MobilePasswordResetOtp;
import com.mydev.ecommerce.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MobilePasswordResetOtpRepository extends JpaRepository<MobilePasswordResetOtp, Long> {

    Optional<MobilePasswordResetOtp> findTopByPhoneAndUsedAtIsNullOrderByCreatedAtDesc(String phone);

    List<MobilePasswordResetOtp> findByUserAndUsedAtIsNull(User user);
}