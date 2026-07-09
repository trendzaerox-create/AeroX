package com.mydev.ecommerce.auth.dto;

public record AuthResponse(
    String accessToken,
    Long userId,
    String email,
    String role,
    String name
) {}