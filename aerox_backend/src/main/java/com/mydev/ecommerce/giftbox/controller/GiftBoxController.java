package com.mydev.ecommerce.giftbox.controller;

import com.mydev.ecommerce.giftbox.dto.GiftBoxSummaryResponse;
import com.mydev.ecommerce.giftbox.service.GiftBoxService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gift-boxes")
public class GiftBoxController {

    private final GiftBoxService giftBoxService;

    public GiftBoxController(GiftBoxService giftBoxService) {
        this.giftBoxService = giftBoxService;
    }

    @GetMapping
    public ResponseEntity<List<GiftBoxSummaryResponse>> getActiveGiftBoxes() {
        return ResponseEntity.ok(giftBoxService.getActiveGiftBoxes());
    }
}