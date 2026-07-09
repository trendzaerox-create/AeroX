package com.mydev.ecommerce.auth.service;

import com.mydev.ecommerce.auth.dto.MobilePasswordResetConfirmRequest;
import com.mydev.ecommerce.auth.dto.MobilePasswordResetRequest;
import com.mydev.ecommerce.auth.model.MobilePasswordResetOtp;
import com.mydev.ecommerce.auth.otp.OtpSender;
import com.mydev.ecommerce.auth.repository.MobilePasswordResetOtpRepository;
import com.mydev.ecommerce.auth.dto.MobilePasswordResetByEmailRequest;

import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MobilePasswordResetService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final MobilePasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpSender otpSender;

    @Value("${app.mobile-password-reset.expiry-minutes:5}")
    private long expiryMinutes;

    @Value("${app.mobile-password-reset.max-attempts:5}")
    private int maxAttempts;

    @Transactional
    public void requestMobileOtp(MobilePasswordResetRequest request) {
        String phone = normalizePhone(request.phone());

        userRepository.findByPhone(phone).ifPresentOrElse(user -> {
            expireOldActiveOtps(user);

            String otp = generateSixDigitOtp();
            String otpHash = hashOtp(phone, otp);

            MobilePasswordResetOtp resetOtp = new MobilePasswordResetOtp();
            resetOtp.setUser(user);
            resetOtp.setPhone(phone);
            resetOtp.setOtpHash(otpHash);
            resetOtp.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
            resetOtp.setAttemptCount(0);
            resetOtp.setCreatedAt(LocalDateTime.now());

            otpRepository.save(resetOtp);

            otpSender.sendOtp(phone, otp);

            log.info("Mobile password reset OTP triggered for userId={}", user.getId());

        }, () -> {
            /*
             * Do not reveal whether this phone exists.
             */
            log.warn("Mobile password reset requested for non-existing phone={}", phone);
        });
    }










    @Transactional
public void requestMobileOtpByEmail(MobilePasswordResetByEmailRequest request) {
    String cleanEmail = request.email() == null
            ? ""
            : request.email().trim().toLowerCase();

    userRepository.findByEmailIgnoreCase(cleanEmail).ifPresent(user -> {
        String phone = normalizePhone(user.getPhone());

        if (phone.isBlank()) {
            log.warn("Mobile OTP requested but phone missing. userId={}", user.getId());
            return;
        }

        expireOldActiveOtps(user);

        String otp = generateSixDigitOtp();
        String otpHash = hashOtp(phone, otp);

        MobilePasswordResetOtp resetOtp = new MobilePasswordResetOtp();
        resetOtp.setUser(user);
        resetOtp.setPhone(phone);
        resetOtp.setOtpHash(otpHash);
        resetOtp.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        resetOtp.setAttemptCount(0);
        resetOtp.setCreatedAt(LocalDateTime.now());

        otpRepository.save(resetOtp);
        otpSender.sendOtp(phone, otp);

        log.info("Mobile password reset OTP by email triggered for userId={}", user.getId());
    });
}















    @Transactional
    public void resetPasswordWithMobileOtp(MobilePasswordResetConfirmRequest request) {
        String phone = normalizePhone(request.phone());

        if (!request.newPassword().equals(request.repeatPassword())) {
            throw new IllegalArgumentException("New password and repeat password do not match");
        }

        if (request.newPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        MobilePasswordResetOtp resetOtp = otpRepository
                .findTopByPhoneAndUsedAtIsNullOrderByCreatedAtDesc(phone)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired OTP"));

        if (resetOtp.isExpired()) {
            resetOtp.setUsedAt(LocalDateTime.now());
            otpRepository.save(resetOtp);
            throw new IllegalArgumentException("OTP expired. Please request a new OTP.");
        }

        if (resetOtp.getAttemptCount() >= maxAttempts) {
            resetOtp.setUsedAt(LocalDateTime.now());
            otpRepository.save(resetOtp);
            throw new IllegalArgumentException("Too many wrong attempts. Please request a new OTP.");
        }

        String inputOtpHash = hashOtp(phone, request.otp());

        if (!inputOtpHash.equals(resetOtp.getOtpHash())) {
            resetOtp.setAttemptCount(resetOtp.getAttemptCount() + 1);
            otpRepository.save(resetOtp);
            throw new IllegalArgumentException("Invalid OTP");
        }

        User user = resetOtp.getUser();

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));

        resetOtp.setUsedAt(LocalDateTime.now());

        userRepository.save(user);
        otpRepository.save(resetOtp);

        log.info("Mobile password reset success for userId={}", user.getId());
    }

    private void expireOldActiveOtps(User user) {
        List<MobilePasswordResetOtp> activeOtps = otpRepository.findByUserAndUsedAtIsNull(user);

        if (activeOtps.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        for (MobilePasswordResetOtp otp : activeOtps) {
            otp.setUsedAt(now);
        }

        otpRepository.saveAll(activeOtps);
    }

    private String generateSixDigitOtp() {
        int number = SECURE_RANDOM.nextInt(1_000_000);
        return String.format("%06d", number);
    }

    private String hashOtp(String phone, String otp) {
        try {
            String value = phone + ":" + otp;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Could not hash OTP", e);
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return "";
        }

        return phone.replaceAll("\\D", "").trim();
    }
}