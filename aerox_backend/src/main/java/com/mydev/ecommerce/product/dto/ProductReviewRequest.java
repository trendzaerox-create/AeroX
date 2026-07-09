package com.mydev.ecommerce.product.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductReviewRequest(

        @NotBlank
        @Size(max = 120)
        String reviewerName,

        @NotNull
        @Min(1)
        @Max(5)
        Integer rating,

        @NotBlank
        String reviewText,

        Boolean featured
) {}