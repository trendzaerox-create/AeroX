package com.mydev.ecommerce.hero.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record HeroSectionRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @Size(max = 5000, message = "Description must be at most 5000 characters")
        String description,

        @NotBlank(message = "Image URL is required")
        @Size(max = 500, message = "Image URL must be at most 500 characters")
        String imageUrl,

        @Size(max = 255, message = "Cloudinary public id must be at most 255 characters")
        String cloudinaryPublicId,

        @NotNull(message = "Product id is required")
        Long productId,

        @NotNull(message = "Sort order is required")
        @Min(value = 0, message = "Sort order cannot be negative")
        Integer sortOrder,

        @NotNull(message = "Active status is required")
        Boolean active
) {
}