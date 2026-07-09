package com.mydev.ecommerce.giftset.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GiftSetItemResponse {

    private Long cartItemId;

    private Long productId;
    private String productTitle;
    private Integer productPriceInr;
    private String productImagePath;

    private Long giftBoxId;
    private String giftBoxName;
    private Integer giftBoxPriceInr;
    private String giftBoxImagePath;

    private Integer lineTotalInr;
}