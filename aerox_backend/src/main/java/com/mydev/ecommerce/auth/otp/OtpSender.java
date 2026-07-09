package com.mydev.ecommerce.auth.otp;

public interface OtpSender {

    void sendOtp(String phone, String otp);
}