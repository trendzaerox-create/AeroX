package com.mydev.ecommerce.giftset.dto;

import java.math.BigDecimal;

public record CreateGiftSetRazorpayOrderResponse(
        Long orderId,
        String orderNumber,
        String razorpayOrderId,
        BigDecimal amount,
        String currency,
        String key
) {
}