package com.mydev.ecommerce.wishlist.controller;

import com.mydev.ecommerce.wishlist.dto.WishlistItemResponse;
import com.mydev.ecommerce.wishlist.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<WishlistItemResponse> getMyWishlist() {
        return wishlistService.getMyWishlist();
    }

    @PostMapping("/{productId}")
    public List<WishlistItemResponse> addToWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService.addToWishlist(productId);
    }

    @DeleteMapping("/{productId}")
    public List<WishlistItemResponse> removeFromWishlist(
            @PathVariable Long productId
    ) {
        return wishlistService.removeFromWishlist(productId);
    }

    @GetMapping("/check/{productId}")
    public Map<String, Boolean> checkWishlist(
            @PathVariable Long productId
    ) {
        return Map.of("exists", wishlistService.checkWishlist(productId));
    }
}