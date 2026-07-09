

package com.mydev.ecommerce.brandshowcase.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record BrandShowcaseResponse(
        Long id,
        String title,
        String subtitle,
        String modelImageUrl,
        String cloudinaryPublicId,
        Integer displayOrder,
        Boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        List<BrandShowcaseProductResponse> products
) {
    public record BrandShowcaseProductResponse(
            Long id,
            String title,
            String description,
            Integer priceInr,
            Integer stock,
            Long categoryId,
            String categoryName,
            String imageUrl,
            List<String> imageUrls,
            Boolean active
    ) {}
}