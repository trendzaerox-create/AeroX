package com.mydev.ecommerce.wishlist.dto;

import java.util.List;

public record WishlistItemResponse(
        Long wishlistId,
        Long productId,
        String title,
        String description,
        Integer priceInr,
        Integer mrpInr,
        Integer stock,
        Integer discountPercent,
        List<String> images
) {
}