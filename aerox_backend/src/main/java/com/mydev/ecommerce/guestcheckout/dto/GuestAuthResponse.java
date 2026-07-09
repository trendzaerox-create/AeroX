package com.mydev.ecommerce.guestcheckout.dto;

public record GuestAuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        String role,
        boolean existingUser
) {
}