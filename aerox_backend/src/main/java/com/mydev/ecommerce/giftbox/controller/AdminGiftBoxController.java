package com.mydev.ecommerce.giftbox.controller;

import com.mydev.ecommerce.giftbox.dto.GiftBoxRequest;
import com.mydev.ecommerce.giftbox.dto.GiftBoxResponse;
import com.mydev.ecommerce.giftbox.service.GiftBoxService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/gift-boxes")
public class AdminGiftBoxController {

    private final GiftBoxService giftBoxService;

    public AdminGiftBoxController(GiftBoxService giftBoxService) {
        this.giftBoxService = giftBoxService;
    }

    @GetMapping
    public ResponseEntity<List<GiftBoxResponse>> getAll() {
        return ResponseEntity.ok(giftBoxService.getAllAdminGiftBoxes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiftBoxResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(giftBoxService.getAdminGiftBoxById(id));
    }

    @PostMapping
    public ResponseEntity<GiftBoxResponse> create(@Valid @RequestBody GiftBoxRequest request) {
        return ResponseEntity.ok(giftBoxService.createGiftBox(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GiftBoxResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody GiftBoxRequest request
    ) {
        return ResponseEntity.ok(giftBoxService.updateGiftBox(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<GiftBoxResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean active = Boolean.TRUE.equals(body.get("active"));
        return ResponseEntity.ok(giftBoxService.updateStatus(id, active));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        giftBoxService.softDeleteGiftBox(id);
        return ResponseEntity.noContent().build();
    }
}