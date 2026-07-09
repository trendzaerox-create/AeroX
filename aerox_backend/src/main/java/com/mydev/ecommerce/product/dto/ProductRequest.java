


package com.mydev.ecommerce.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProductRequest(

        @NotBlank
        @Size(max = 500)
        String title,

        String description,

        // Final selling price
        @NotNull
        Integer priceInr,

        // Maximum Retail Price
        @NotNull
        Integer mrpInr,

        // Discounted price
        @NotNull
        Integer discountInr,

        @NotNull
        Integer stock,

        Integer displayOrder,

        @NotNull
        Long categoryId,

        List<String> images,

        String shortHighlights,

        String specificationsJson,

        String featureHighlightsJson,

        String faqJson,

        String warrantyInfo,

        String boxContentsJson,

        String compatibility,

        String demoVideoUrl,

        String pdpBannersJson

) {}