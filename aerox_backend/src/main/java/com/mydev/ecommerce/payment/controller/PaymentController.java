

package com.mydev.ecommerce.payment.controller;

import com.mydev.ecommerce.payment.dto.CreateRazorpayOrderRequest;
import com.mydev.ecommerce.payment.dto.CreateRazorpayOrderResponse;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentRequest;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentResponse;
import com.mydev.ecommerce.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public CreateRazorpayOrderResponse createOrder(
            Authentication authentication,
            @Valid @RequestBody CreateRazorpayOrderRequest request
    ) {
        return paymentService.createRazorpayOrder(authentication, request);
    }

    @PostMapping("/verify")
    public VerifyRazorpayPaymentResponse verifyPayment(
            Authentication authentication,
            @Valid @RequestBody VerifyRazorpayPaymentRequest request
    ) {
        return paymentService.verifyRazorpayPayment(authentication, request);
    }
}