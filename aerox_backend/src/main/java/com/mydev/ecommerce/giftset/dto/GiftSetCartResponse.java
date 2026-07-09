package com.mydev.ecommerce.giftset.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GiftSetCartResponse {

    private Long cartId;
    private GiftSetSummaryResponse summary;
}