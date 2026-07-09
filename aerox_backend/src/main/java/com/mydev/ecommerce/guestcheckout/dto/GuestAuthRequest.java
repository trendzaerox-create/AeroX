
package com.mydev.ecommerce.guestcheckout.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record GuestAuthRequest(
        @Email @NotBlank String email,
        @NotBlank String password,
        String name,
        String phone, // ✅ ADDED
        @Valid List<GuestCartItemRequest> items
) {
}