package com.mydev.ecommerce.product.dto;

public record ProductReviewResponse(
        Long id,
        String reviewerName,
        Integer rating,
        String reviewText,
        boolean featured
) {}