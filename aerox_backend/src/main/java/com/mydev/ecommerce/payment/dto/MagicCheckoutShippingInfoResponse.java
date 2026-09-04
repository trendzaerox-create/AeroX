package com.mydev.ecommerce.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MagicCheckoutShippingInfoResponse(
        List<Address> addresses
) {
    public record Address(
            String id,
            String zipcode,
            String country,
            @JsonProperty("shipping_methods") List<ShippingMethod> shippingMethods
    ) {}

    public record ShippingMethod(
            String id,
            String description,
            String name,
            boolean serviceable,
            @JsonProperty("shipping_fee") long shippingFee,
            boolean cod,
            @JsonProperty("cod_fee") long codFee
    ) {}
}
