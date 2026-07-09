package com.mydev.ecommerce.instagram.controller;

import com.mydev.ecommerce.instagram.entity.InstagramAuth;
import com.mydev.ecommerce.instagram.service.InstagramTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/instagram")
public class InstagramAdminBootstrapController {

    private final InstagramTokenService instagramTokenService;

    @Value("${app.instagram.admin-refresh-secret}")
    private String adminRefreshSecret;

    public InstagramAdminBootstrapController(InstagramTokenService instagramTokenService) {
        this.instagramTokenService = instagramTokenService;
    }

    @PostMapping("/bootstrap-token")
    public ResponseEntity<?> bootstrapToken(
            @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret,
            @RequestBody Map<String, Object> body
    ) {
        if (secret == null || !secret.equals(adminRefreshSecret)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String instagramUserId = body.get("instagramUserId") != null ? body.get("instagramUserId").toString() : null;
        String accessToken = body.get("accessToken") != null ? body.get("accessToken").toString() : null;
        Integer expiresIn = body.get("expiresIn") != null ? Integer.parseInt(body.get("expiresIn").toString()) : 5184000;

        if (instagramUserId == null || instagramUserId.isBlank() || accessToken == null || accessToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "instagramUserId and accessToken are required"));
        }

        InstagramAuth saved = instagramTokenService.saveInitialLongLivedToken(instagramUserId, accessToken, expiresIn);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "instagramUserId", saved.getInstagramUserId(),
                "expiresAt", saved.getExpiresAt(),
                "refreshedAt", saved.getRefreshedAt()
        ));
    }
}