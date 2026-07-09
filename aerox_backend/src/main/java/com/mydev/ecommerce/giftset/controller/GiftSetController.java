package com.mydev.ecommerce.giftset.controller;

import com.mydev.ecommerce.giftset.dto.GiftSetRequest;
import com.mydev.ecommerce.giftset.dto.GiftSetSummaryResponse;
import com.mydev.ecommerce.giftset.service.GiftSetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/giftsets")
public class GiftSetController {

    private final GiftSetService giftSetService;

    public GiftSetController(GiftSetService giftSetService) {
        this.giftSetService = giftSetService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<GiftSetSummaryResponse> calculate(@Valid @RequestBody GiftSetRequest request) {
        return ResponseEntity.ok(giftSetService.calculate(request));
    }
}