
package com.mydev.ecommerce.giftbox.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GiftBoxRequest {

    @NotBlank(message = "Gift box name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0)
    private Integer priceInr;

    private String imagePath;

    // 🔥 NEW
    private String cloudinaryPublicId;

    @NotNull(message = "Stock is required")
    @Min(value = 0)
    private Integer stock;

    private Boolean active = true;
}