




package com.mydev.ecommerce.auth.service;

import com.mydev.ecommerce.auth.dto.*;
import com.mydev.ecommerce.auth.security.JwtService;
import com.mydev.ecommerce.common.constants.Roles;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class AuthService {

  private final UserRepository userRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepo,
                     PasswordEncoder passwordEncoder,
                     JwtService jwtService) {

    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest req) {

    if (userRepo.existsByEmail(req.email().toLowerCase())) { // ✅ CHANGE
      throw new RuntimeException("Email already registered");
    }

    User u = new User();

    u.setName(req.name());
    u.setEmail(req.email().toLowerCase());

    u.setPhone(req.phone()); // ✅ CHANGE (IMPORTANT FIX)

    u.setPasswordHash(passwordEncoder.encode(req.password()));

    u.setRole(Roles.CUSTOMER);

    u.setCreatedAt(OffsetDateTime.now());

    u = userRepo.save(u);

    String token = jwtService.generateToken(
        u.getId(),
        u.getEmail(),
        u.getRole()
    );

    return new AuthResponse(
        token,
        u.getId(),
        u.getEmail(),
        u.getRole(),
        u.getName()
    );
  }

  public AuthResponse login(LoginRequest req) {

    User u = userRepo.findByEmail(req.email().toLowerCase())
        .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
      throw new RuntimeException("Invalid email or password");
    }

    String token = jwtService.generateToken(
        u.getId(),
        u.getEmail(),
        u.getRole()
    );

    return new AuthResponse(
        token,
        u.getId(),
        u.getEmail(),
        u.getRole(),
        u.getName()
    );
  }
}