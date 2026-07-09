package com.mydev.ecommerce.payment.dto;

public record VerifyRazorpayPaymentResponse(
        String message,
        Long orderId,
        String orderNumber,
        String paymentStatus
) {}