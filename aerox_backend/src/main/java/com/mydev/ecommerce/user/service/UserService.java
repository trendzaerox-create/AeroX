

package com.mydev.ecommerce.user.service;

import com.mydev.ecommerce.user.dto.*;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo,
                       PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getProfile(String email) {

        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole(),
                u.getPhone()
        );
    }

    public UserProfileResponse updateProfile(String email, UpdateProfileRequest req) {

        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setName(req.name());
        u.setPhone(req.phone());

        userRepo.save(u);

        return new UserProfileResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole(),
                u.getPhone()
        );
    }

    public void changePassword(String email, ChangePasswordRequest req) {

        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.currentPassword(), u.getPasswordHash())) {
            throw new RuntimeException("Current password incorrect");
        }

        u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepo.save(u);
    }

    public void deleteAccount(String email) {

        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepo.delete(u);
    }
}