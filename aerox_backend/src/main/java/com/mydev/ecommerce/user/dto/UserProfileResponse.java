package com.mydev.ecommerce.user.dto;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String role,
        String phone
) {}