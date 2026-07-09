package com.mydev.ecommerce.giftset.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GiftSetItemRequest {

    @NotNull(message = "Product id is required")
    private Long productId;

    @NotNull(message = "Gift box id is required")
    private Long giftBoxId;
}