package com.mydev.ecommerce.bulkorder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BulkOrderInquiryRequest(
        @NotNull(message = "Product is required")
        Long productId,

        @NotBlank(message = "Name is required")
        @Size(max = 120)
        String customerName,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        @Size(max = 160)
        String email,

        @NotBlank(message = "Phone is required")
        @Size(max = 30)
        String phone,

        @Size(max = 160)
        String companyName,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity,

        @Size(max = 5000)
        String message
) {}