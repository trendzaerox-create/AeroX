



package com.mydev.ecommerce.instagram.controller;

import com.mydev.ecommerce.instagram.dto.InstagramRefreshResponse;
import com.mydev.ecommerce.instagram.entity.InstagramAuth;
import com.mydev.ecommerce.instagram.service.InstagramMediaService;
import com.mydev.ecommerce.instagram.service.InstagramTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/instagram")
public class InstagramAdminController {

    private final InstagramTokenService instagramTokenService;
    private final InstagramMediaService instagramMediaService;

    @Value("${app.instagram.admin-refresh-secret}")
    private String adminRefreshSecret;

    public InstagramAdminController(
            InstagramTokenService instagramTokenService,
            InstagramMediaService instagramMediaService
    ) {
        this.instagramTokenService = instagramTokenService;
        this.instagramMediaService = instagramMediaService;
    }

    private boolean isUnauthorized(String secret) {
        return secret == null || adminRefreshSecret == null || !secret.equals(adminRefreshSecret);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret
    ) {
        if (isUnauthorized(secret)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        InstagramRefreshResponse response = instagramTokenService.forceRefresh();

        if (!response.isOk()) {
            return ResponseEntity.status(response.isNeedsReconnect() ? 400 : 500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update-token")
    public ResponseEntity<?> updateToken(
            @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret,
            @RequestBody Map<String, String> body
    ) {
        if (isUnauthorized(secret)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String newToken = body.get("accessToken");

        if (newToken == null || newToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "accessToken required"));
        }

        InstagramAuth auth = instagramTokenService.getActiveAuthOrThrow();

        instagramTokenService.saveInitialLongLivedToken(
                auth.getInstagramUserId(),
                newToken.trim(),
                60 * 24 * 60 * 60
        );

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "Instagram token updated successfully"
        ));
    }

    // @PostMapping("/refresh-media-cache")
    // public ResponseEntity<?> refreshMediaCache(
    //         @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret
    // ) {
    //     if (isUnauthorized(secret)) {
    //         return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    //     }

    //     var posts = instagramMediaService.refreshCacheNow();

    //     return ResponseEntity.ok(Map.of(
    //             "ok", true,
    //             "message", "Instagram media cache refreshed successfully",
    //             "count", posts.size(),
    //             "cacheUpdatedAt", instagramMediaService.getCacheUpdatedAt()
    //     ));
    // }


    @PostMapping("/refresh-media-cache")
public ResponseEntity<?> refreshMediaCache(
        @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret
) {
    if (isUnauthorized(secret)) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    try {
        var posts = instagramMediaService.refreshCacheNow();

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "Instagram media cache refreshed successfully",
                "count", posts.size(),
                "cacheUpdatedAt", instagramMediaService.getCacheUpdatedAt()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
                "ok", false,
                "error", e.getMessage(),
                "cause", e.getCause() != null ? e.getCause().getMessage() : "No cause"
        ));
    }
}





    @GetMapping("/status")
    public ResponseEntity<?> status(
            @RequestHeader(value = "X-Admin-Refresh-Secret", required = false) String secret
    ) {
        if (isUnauthorized(secret)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Optional<InstagramAuth> authOpt = instagramTokenService.getActiveAuth();

        if (authOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "ok", true,
                    "configured", false,
                    "message", "Instagram token not configured yet",
                    "cacheUpdatedAt", instagramMediaService.getCacheUpdatedAt()
            ));
        }

        InstagramAuth auth = authOpt.get();

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "configured", true,
                "instagramUserId", auth.getInstagramUserId(),
                "expiresAt", auth.getExpiresAt(),
                "refreshedAt", auth.getRefreshedAt(),
                "active", auth.isActive(),
                "expired", auth.isExpired(),
                "cacheUpdatedAt", instagramMediaService.getCacheUpdatedAt()
        ));
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "Instagram admin controller working"
        ));
    }
}