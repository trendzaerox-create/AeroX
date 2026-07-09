package com.mydev.ecommerce.cart.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MergeCartRequest {
    private List<MergeCartItemRequest> items = new ArrayList<>();
}