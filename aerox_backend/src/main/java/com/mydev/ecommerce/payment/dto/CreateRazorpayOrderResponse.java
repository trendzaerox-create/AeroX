package com.mydev.ecommerce.payment.dto;

import java.math.BigDecimal;

public record CreateRazorpayOrderResponse(
        Long orderId,
        String orderNumber,
        String razorpayOrderId,
        BigDecimal amount,
        String currency,
        String key
) {}