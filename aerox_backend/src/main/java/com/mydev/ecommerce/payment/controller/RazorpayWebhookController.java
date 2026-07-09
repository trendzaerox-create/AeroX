package com.mydev.ecommerce.payment.controller;

import com.mydev.ecommerce.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final PaymentService paymentService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(
                    value = "X-Razorpay-Signature",
                    required = false
            )
            String razorpaySignature
    ) {
        paymentService.handleRazorpayWebhook(
                rawPayload,
                razorpaySignature
        );

        return ResponseEntity.ok("OK");
    }
}