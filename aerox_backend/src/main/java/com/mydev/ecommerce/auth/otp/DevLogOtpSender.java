package com.mydev.ecommerce.auth.otp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@ConditionalOnProperty(
        name = "app.otp.provider",
        havingValue = "DEV_LOG",
        matchIfMissing = true
)
public class DevLogOtpSender implements OtpSender {

    @Override
    public void sendOtp(String phone, String otp) {
        log.warn("=========================================");
        log.warn("DEV MOBILE PASSWORD RESET OTP");
        log.warn("Phone: {}", phone);
        log.warn("OTP: {}", otp);
        log.warn("=========================================");
    }
}