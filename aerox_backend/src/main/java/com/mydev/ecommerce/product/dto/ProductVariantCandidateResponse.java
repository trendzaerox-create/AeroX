package com.mydev.ecommerce.product.dto;

public record ProductVariantCandidateResponse(
        Long id,
        String title,
        Long categoryId,
        String category,
        String variantGroupCode,
        String colorName,
        String colorHex,
        String thumbnailUrl
) {}
