package com.mydev.ecommerce.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveredEmailPayload {

    private Long orderId;

    private String orderNumber;

    private String customerName;

    private String customerEmail;

    private BigDecimal totalAmount;

    private OffsetDateTime deliveredAt;

    private List<DeliveredEmailItemPayload> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveredEmailItemPayload {

        private Long productId;

        private String productTitle;

        private String imageUrl;

        private Integer quantity;
    }
}