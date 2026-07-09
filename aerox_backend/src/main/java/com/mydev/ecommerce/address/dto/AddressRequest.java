package com.mydev.ecommerce.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(

        @NotBlank
        @Size(max = 120)
        String fullName,

        @NotBlank
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        String phone,

        @NotBlank
        @Size(max = 255)
        String line1,

        @Size(max = 255)
        String line2,

        @NotBlank
        @Size(max = 120)
        String city,

        @NotBlank
        @Size(max = 120)
        String state,

        @NotBlank
        @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
        String pincode,

        @NotBlank
        @Size(max = 80)
        String country,

        Boolean isDefault
) {}