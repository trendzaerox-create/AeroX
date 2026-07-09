package com.mydev.ecommerce.giftset.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GiftSetRequest {

    @NotEmpty(message = "At least 1 item is required")
    @Size(max = 5, message = "Maximum 5 items allowed in gift set")
    @Valid
    private List<GiftSetItemRequest> items;
}
