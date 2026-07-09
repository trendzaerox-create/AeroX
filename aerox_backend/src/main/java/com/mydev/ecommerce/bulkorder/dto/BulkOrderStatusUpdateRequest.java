package com.mydev.ecommerce.bulkorder.dto;

import com.mydev.ecommerce.bulkorder.model.BulkOrderInquiryStatus;
import jakarta.validation.constraints.NotNull;

public record BulkOrderStatusUpdateRequest(
        @NotNull(message = "Status is required")
        BulkOrderInquiryStatus status
) {}