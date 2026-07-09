package com.mydev.ecommerce.address.dto;

public record AddressResponse(
        Long id,
        String fullName,
        String phone,
        String line1,
        String line2,
        String city,
        String state,
        String pincode,
        String country,
        Boolean isDefault
) {}