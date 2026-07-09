package com.mydev.ecommerce.giftbox.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GiftBoxSummaryResponse {

    private Long id;
    private String name;
    private Integer priceInr;
    private String imagePath;
    private Integer stock;
    private boolean active;
}