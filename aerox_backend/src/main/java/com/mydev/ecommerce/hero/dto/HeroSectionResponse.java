package com.mydev.ecommerce.hero.dto;

public record HeroSectionResponse(
        Long id,
        String title,
        String description,
        String imageUrl,
        String cloudinaryPublicId,
        Long productId,
        String productTitle,
        Integer sortOrder,
        boolean active
) {
}