package com.mydev.ecommerce.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Category name must not exceed 100 characters")
        String name,

        List<@Size(max = 500, message = "Category image URL must not exceed 500 characters") String> imageUrls,

        List<@Size(max = 500, message = "Category banner image URL must not exceed 500 characters") String> bannerImageUrls,

        List<@Size(max = 500, message = "Category thin banner image URL must not exceed 500 characters") String> thinBannerImageUrls

) {}