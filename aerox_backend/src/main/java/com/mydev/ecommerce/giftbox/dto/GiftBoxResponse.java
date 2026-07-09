
package com.mydev.ecommerce.giftbox.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class GiftBoxResponse {

    private Long id;
    private String name;
    private String description;
    private Integer priceInr;
    private String imagePath;

    // 🔥 NEW
    private String cloudinaryPublicId;

    private Integer stock;
    private boolean active;
    private boolean deleted;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}