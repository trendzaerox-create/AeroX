package com.mydev.ecommerce.giftset.dto;

import java.math.BigDecimal;

public record GiftSetOrderItemResponse(
        Long id,
        Long productId,
        String productTitle,
        String productImageUrl,
        BigDecimal productPrice,
        Long giftBoxId,
        String giftBoxName,
        String giftBoxImageUrl,
        BigDecimal giftBoxPrice,
        BigDecimal lineTotal
) {
}