

package com.mydev.ecommerce.auth.controller;

import com.mydev.ecommerce.auth.dto.ForgotPasswordRequest;
import com.mydev.ecommerce.auth.dto.MessageResponse;
import com.mydev.ecommerce.auth.dto.MobilePasswordResetConfirmRequest;
import com.mydev.ecommerce.auth.dto.MobilePasswordResetRequest;
import com.mydev.ecommerce.auth.dto.ResetPasswordRequest;
import com.mydev.ecommerce.auth.service.MobilePasswordResetService;
import com.mydev.ecommerce.auth.service.PasswordResetService;

import com.mydev.ecommerce.auth.dto.MobilePasswordResetByEmailRequest;
import com.mydev.ecommerce.auth.dto.PasswordResetOptionsResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;
    private final MobilePasswordResetService mobilePasswordResetService;

    /* ================================
       EMAIL RESET - EXISTING FLOW
       Frontend:
       POST /api/auth/forgot-password
       POST /api/auth/reset-password
    ================================ */










    @GetMapping("/password-reset/options")
public ResponseEntity<PasswordResetOptionsResponse> passwordResetOptions(
        @RequestParam String email
) {
    return ResponseEntity.ok(passwordResetService.getResetOptions(email));
}

@PostMapping("/forgot-password/mobile/by-email")
public ResponseEntity<MessageResponse> forgotPasswordMobileByEmail(
        @Valid @RequestBody MobilePasswordResetByEmailRequest request
) {
    mobilePasswordResetService.requestMobileOtpByEmail(request);

    return ResponseEntity.ok(
            new MessageResponse(
                    "If an account exists with this email and mobile number, an OTP has been sent."
            )
    );
}




    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        passwordResetService.requestReset(request.getEmail());

        /*
         * Always return the same message.
         * This prevents attackers from checking which emails are registered.
         */
        return ResponseEntity.ok(
                new MessageResponse(
                        "If an account exists with this email, a password reset link has been sent."
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        passwordResetService.resetPassword(request);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Password reset successful. You can now login with your new password."
                )
        );
    }

    /* ================================
       MOBILE OTP RESET - NEW FLOW
       Frontend:
       POST /api/auth/forgot-password/mobile
       POST /api/auth/reset-password/mobile
    ================================ */

    @PostMapping("/forgot-password/mobile")
    public ResponseEntity<MessageResponse> forgotPasswordMobile(
            @Valid @RequestBody MobilePasswordResetRequest request
    ) {
        mobilePasswordResetService.requestMobileOtp(request);

        /*
         * Always return the same message.
         * This prevents attackers from checking which mobile numbers are registered.
         */
        return ResponseEntity.ok(
                new MessageResponse(
                        "If an account exists with this mobile number, an OTP has been sent."
                )
        );
    }

    @PostMapping("/reset-password/mobile")
    public ResponseEntity<MessageResponse> resetPasswordMobile(
            @Valid @RequestBody MobilePasswordResetConfirmRequest request
    ) {
        mobilePasswordResetService.resetPasswordWithMobileOtp(request);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Password reset successful. You can now login with your new password."
                )
        );
    }
}