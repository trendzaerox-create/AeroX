package com.mydev.ecommerce.giftset.controller;

import com.mydev.ecommerce.giftset.dto.AddGiftSetCartItemRequest;
import com.mydev.ecommerce.giftset.dto.GiftSetCartResponse;
import com.mydev.ecommerce.giftset.service.GiftSetCartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/giftset-cart")
@RequiredArgsConstructor
public class GiftSetCartController {

    private final GiftSetCartService giftSetCartService;

    @GetMapping
    public ResponseEntity<GiftSetCartResponse> getMyCart(Principal principal) {
        return ResponseEntity.ok(giftSetCartService.getMyCart(principal));
    }

    @PostMapping("/items")
    public ResponseEntity<GiftSetCartResponse> addItem(
            Principal principal,
            @Valid @RequestBody AddGiftSetCartItemRequest request
    ) {
        return ResponseEntity.ok(giftSetCartService.addItem(principal, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<GiftSetCartResponse> removeItem(
            Principal principal,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(giftSetCartService.removeItem(principal, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<GiftSetCartResponse> clearCart(Principal principal) {
        return ResponseEntity.ok(giftSetCartService.clearCart(principal));
    }
}