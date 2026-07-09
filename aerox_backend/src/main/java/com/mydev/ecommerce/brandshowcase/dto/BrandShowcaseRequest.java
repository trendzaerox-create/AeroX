package com.mydev.ecommerce.brandshowcase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BrandShowcaseRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @Size(max = 500, message = "Subtitle must be at most 500 characters")
        String subtitle,

        @NotBlank(message = "Model image URL is required")
        @Size(max = 500, message = "Model image URL must be at most 500 characters")
        String modelImageUrl,

        @Size(max = 255, message = "Cloudinary public id must be at most 255 characters")
        String cloudinaryPublicId,

        @NotNull(message = "Display order is required")
        Integer displayOrder,

        @NotNull(message = "Active status is required")
        Boolean active,

        @NotEmpty(message = "At least 1 product is required")
        List<Long> productIds
) {}