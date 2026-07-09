package com.mydev.ecommerce.cart.controller;

import com.mydev.ecommerce.cart.dto.*;
import com.mydev.ecommerce.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getMyCart(Principal principal) {
        return cartService.getMyCart(principal);
    }

    @PostMapping("/items")
    public CartResponse addItem(
            Principal principal,
            @Valid @RequestBody AddToCartRequest request
    ) {
        return cartService.addItem(principal, request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(
            Principal principal,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateItem(principal, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(
            Principal principal,
            @PathVariable Long itemId
    ) {
        return cartService.removeItem(principal, itemId);
    }

    @DeleteMapping("/clear")
    public CartResponse clearCart(Principal principal) {
        return cartService.clearCart(principal);
    }

    @PostMapping("/merge")
    public CartResponse mergeCart(
            Principal principal,
            @RequestBody MergeCartRequest request
    ) {
        return cartService.mergeCart(principal, request);
    }
}