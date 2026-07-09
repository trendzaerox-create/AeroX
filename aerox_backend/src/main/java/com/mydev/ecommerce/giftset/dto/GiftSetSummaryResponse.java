package com.mydev.ecommerce.giftset.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class GiftSetSummaryResponse {

    private List<GiftSetItemResponse> items;
    private Integer totalProducts;
    private Integer subtotalInr;
    private Integer discountPercent;
    private Integer discountAmountInr;
    private Integer finalTotalInr;
}