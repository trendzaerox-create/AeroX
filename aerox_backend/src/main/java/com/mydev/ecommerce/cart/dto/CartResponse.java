package com.mydev.ecommerce.cart.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private Integer totalItems;
    private BigDecimal subtotal;
}