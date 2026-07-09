package com.mydev.ecommerce.guestcheckout.controller;

import com.mydev.ecommerce.guestcheckout.dto.EmailCheckResponse;
import com.mydev.ecommerce.guestcheckout.dto.GuestAuthRequest;
import com.mydev.ecommerce.guestcheckout.dto.GuestAuthResponse;
import com.mydev.ecommerce.guestcheckout.service.GuestCheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest-checkout")
@RequiredArgsConstructor
public class GuestCheckoutController {

    private final GuestCheckoutService guestCheckoutService;

    @GetMapping("/check-email")
    public EmailCheckResponse checkEmail(@RequestParam String email) {
        return guestCheckoutService.checkEmail(email);
    }

    @PostMapping("/continue")
    public GuestAuthResponse continueAsGuestOrCustomer(
            @Valid @RequestBody GuestAuthRequest request
    ) {
        return guestCheckoutService.continueAsGuestOrCustomer(request);
    }
}