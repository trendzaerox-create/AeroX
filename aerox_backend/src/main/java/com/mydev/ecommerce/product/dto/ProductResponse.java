

// package com.mydev.ecommerce.product.dto;

// import java.util.List;

// public record ProductResponse(
//         Long id,
//         String title,
//         String description,

//         Integer priceInr,
//         Integer mrpInr,
//         Integer discountInr,
//         Integer discountPercent,

//         Integer stock,

//         Integer displayOrder,
//         Long categoryId,
//         String category,

//         List<String> images,

//         List<ProductReviewResponse> reviews,

//         Double averageRating,
//         Long reviewCount,

//         String shortHighlights,
//         String specificationsJson,
//         String featureHighlightsJson,
//         String faqJson,
//         String warrantyInfo,
//         String boxContentsJson,
//         String compatibility,
//         String demoVideoUrl,
//         String pdpBannersJson
// ) {}





















package com.mydev.ecommerce.product.dto;

import java.util.List;

public record ProductResponse(
        Long id,
        String title,
        String description,

        Integer priceInr,
        Integer mrpInr,
        Integer discountInr,
        Integer discountPercent,

        Integer stock,

        Integer displayOrder,
        Long categoryId,
        String category,

        List<String> images,

        List<ProductReviewResponse> reviews,

        Double averageRating,
        Long reviewCount,

        String shortHighlights,
        String specificationsJson,
        String featureHighlightsJson,
        String faqJson,
        String warrantyInfo,
        String boxContentsJson,
        String compatibility,
        String demoVideoUrl,
        String pdpBannersJson,

        String variantGroupCode,
        String colorName,
        String colorHex,
        Integer variantDisplayOrder,

        // Populated for a single-product/PDP response; empty for listing responses.
        List<ProductVariantResponse> colorVariants
) {}
