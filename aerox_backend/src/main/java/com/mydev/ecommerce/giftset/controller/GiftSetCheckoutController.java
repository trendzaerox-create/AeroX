package com.mydev.ecommerce.giftset.controller;

import com.mydev.ecommerce.giftset.dto.*;
import com.mydev.ecommerce.giftset.service.GiftSetCheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/giftset-checkout")
@RequiredArgsConstructor
public class GiftSetCheckoutController {

    private final GiftSetCheckoutService giftSetCheckoutService;

    @PostMapping
    public ResponseEntity<GiftSetOrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceGiftSetOrderRequest request
    ) {
        return ResponseEntity.ok(giftSetCheckoutService.placeOrder(authentication, request));
    }

    @PostMapping("/razorpay/create-order")
    public ResponseEntity<CreateGiftSetRazorpayOrderResponse> createRazorpayOrder(
            Authentication authentication,
            @Valid @RequestBody CreateGiftSetRazorpayOrderRequest request
    ) {
        return ResponseEntity.ok(giftSetCheckoutService.createRazorpayOrder(authentication, request));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<VerifyGiftSetRazorpayPaymentResponse> verifyRazorpayPayment(
            Authentication authentication,
            @Valid @RequestBody VerifyGiftSetRazorpayPaymentRequest request
    ) {
        return ResponseEntity.ok(giftSetCheckoutService.verifyRazorpayPayment(authentication, request));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> myOrders(Authentication authentication) {
        return ResponseEntity.ok(giftSetCheckoutService.myOrders(authentication));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> myOrderById(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(giftSetCheckoutService.myOrderById(authentication, id));
    }
}