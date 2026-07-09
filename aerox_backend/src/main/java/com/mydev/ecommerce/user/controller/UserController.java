



package com.mydev.ecommerce.user.controller;

import com.mydev.ecommerce.user.dto.*;
import com.mydev.ecommerce.user.service.UserService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private String getUserEmail(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return auth.getName();
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(Authentication auth) {
        return userService.getProfile(getUserEmail(auth));
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            Authentication auth,
            @Valid @RequestBody UpdateProfileRequest req
    ) {
        return userService.updateProfile(getUserEmail(auth), req);
    }

    @DeleteMapping("/profile")
    public String deleteAccount(Authentication auth) {
        userService.deleteAccount(getUserEmail(auth));
        return "Account deleted successfully";
    }

    @PutMapping("/change-password")
    public String changePassword(
            Authentication auth,
            @RequestBody ChangePasswordRequest req
    ) {
        userService.changePassword(getUserEmail(auth), req);
        return "Password updated successfully";
    }
}