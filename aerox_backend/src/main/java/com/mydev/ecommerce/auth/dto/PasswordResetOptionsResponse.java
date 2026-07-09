package com.mydev.ecommerce.auth.dto;

public record PasswordResetOptionsResponse(
        boolean exists,
        String email,
        boolean hasPhone,
        String maskedPhone
) {}