package com.mydev.ecommerce.payment.controller;

import com.mydev.ecommerce.payment.dto.CreateMagicCheckoutOrderRequest;
import com.mydev.ecommerce.payment.dto.CreateRazorpayOrderResponse;
import com.mydev.ecommerce.payment.dto.MagicCheckoutShippingInfoRequest;
import com.mydev.ecommerce.payment.dto.MagicCheckoutShippingInfoResponse;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentRequest;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentResponse;
import com.mydev.ecommerce.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay/magic")
@RequiredArgsConstructor
public class MagicCheckoutController {

    private final PaymentService paymentService;

    /**
     * Public guest endpoint. The browser sends product ids + quantities only.
     * PaymentService re-reads product price and stock from PostgreSQL.
     */
    @PostMapping("/create-order")
    public CreateRazorpayOrderResponse createOrder(
            @Valid @RequestBody CreateMagicCheckoutOrderRequest request
    ) {
        return paymentService.createGuestMagicCheckoutOrder(request);
    }

    /**
     * Public because a guest has no JWT. Security comes from Razorpay's checkout
     * signature plus a server-side Fetch Payment check.
     */
    @PostMapping("/verify")
    public VerifyRazorpayPaymentResponse verifyPayment(
            @Valid @RequestBody VerifyRazorpayPaymentRequest request
    ) {
        return paymentService.verifyGuestMagicCheckoutPayment(request);
    }

    /**
     * Configure this exact public URL in Razorpay Magic Checkout -> Shipping Setup.
     * Razorpay documentation has shown GET for web and POST for some SDK flows,
     * so accepting both makes the endpoint integration-tolerant.
     */
    @RequestMapping(value = "/shipping-info", method = {RequestMethod.GET, RequestMethod.POST})
    public MagicCheckoutShippingInfoResponse shippingInfo(
            @RequestBody MagicCheckoutShippingInfoRequest request
    ) {
        return paymentService.getMagicCheckoutShippingInfo(request);
    }
}
