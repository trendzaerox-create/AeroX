




package com.mydev.ecommerce.instagram.controller;

import com.mydev.ecommerce.instagram.dto.InstagramPostsResponse;
import com.mydev.ecommerce.instagram.service.InstagramMediaService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/instagram")
public class InstagramController {

    private final InstagramMediaService instagramMediaService;

    public InstagramController(InstagramMediaService instagramMediaService) {
        this.instagramMediaService = instagramMediaService;
    }

    @GetMapping
    public ResponseEntity<?> getInstagramPosts(
            @RequestParam(defaultValue = "12") int limit
    ) {
        try {
            return ResponseEntity.ok()
                    .cacheControl(CacheControl.maxAge(15, TimeUnit.MINUTES).cachePublic())
                    .body(new InstagramPostsResponse(
                            instagramMediaService.getLatestMediaPosts(limit)
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "ok", false,
                            "error", e.getMessage() != null ? e.getMessage() : "Failed to load Instagram posts"
                    )
            );
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(
                Map.of(
                        "ok", true,
                        "message", "Instagram controller working"
                )
        );
    }
}