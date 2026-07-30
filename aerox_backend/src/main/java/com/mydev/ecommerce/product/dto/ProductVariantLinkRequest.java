package com.mydev.ecommerce.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductVariantLinkRequest(

        @NotNull(message = "Select an existing product")
        @Positive(message = "Selected product id must be positive")
        Long groupWithProductId,

        @NotBlank(message = "Current product colour is required")
        @Size(max = 80, message = "Current product colour must not exceed 80 characters")
        String colorName,

        @NotBlank(message = "Current product colour hex is required")
        @Pattern(
                regexp = "^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
                message = "Colour hex must look like #FFFFFF"
        )
        String colorHex,

        @Min(value = 0, message = "Variant display order cannot be negative")
        Integer variantDisplayOrder,

        /**
         * Used only when the selected existing product has no colour name yet.
         */
        @Size(max = 80, message = "Existing product colour must not exceed 80 characters")
        String existingProductColorName,

        /**
         * Used only when the selected existing product has no colour hex yet.
         */
        @Pattern(
                regexp = "^$|^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
                message = "Existing product colour hex is invalid"
        )
        String existingProductColorHex

) {}
