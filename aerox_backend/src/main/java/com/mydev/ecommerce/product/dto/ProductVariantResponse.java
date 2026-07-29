package com.mydev.ecommerce.product.dto;

public record ProductVariantResponse(
        Long id,
        String title,
        String colorName,
        String colorHex,
        Integer variantDisplayOrder,
        Integer priceInr,
        Integer mrpInr,
        Integer stock,
        String thumbnailUrl
) {}
