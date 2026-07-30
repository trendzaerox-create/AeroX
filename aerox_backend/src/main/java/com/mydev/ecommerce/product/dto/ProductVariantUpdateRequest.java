package com.mydev.ecommerce.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductVariantUpdateRequest(

        @Size(max = 120, message = "Variant group code must not exceed 120 characters")
        String variantGroupCode,

        @Size(max = 80, message = "Colour name must not exceed 80 characters")
        String colorName,

        @Pattern(
                regexp = "^$|^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
                message = "Colour hex must look like #111827"
        )
        String colorHex,

        @Min(value = 0, message = "Variant display order cannot be negative")
        Integer variantDisplayOrder

) {}
