package com.mydev.ecommerce.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestEmailPayload {

    private Long orderId;

    private String orderNumber;

    private String customerName;

    private String customerEmail;

    private List<ReviewRequestEmailItemPayload> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewRequestEmailItemPayload {

        private Long productId;

        private String productTitle;

        private String imageUrl;
    }
}