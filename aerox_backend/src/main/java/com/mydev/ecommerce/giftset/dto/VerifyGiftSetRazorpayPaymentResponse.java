package com.mydev.ecommerce.giftset.dto;

public record VerifyGiftSetRazorpayPaymentResponse(
        String message,
        Long orderId,
        String orderNumber,
        String paymentStatus
) {
}