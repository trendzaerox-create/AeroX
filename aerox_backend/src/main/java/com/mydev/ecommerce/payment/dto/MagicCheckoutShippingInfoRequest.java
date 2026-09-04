package com.mydev.ecommerce.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MagicCheckoutShippingInfoRequest(
        @JsonProperty("order_id") String orderId,
        @JsonProperty("razorpay_order_id") String razorpayOrderId,
        String email,
        String contact,
        List<Address> addresses
) {
    public record Address(
            String id,
            String zipcode,
            @JsonProperty("state_code") String stateCode,
            String country
    ) {}
}
