package com.mydev.ecommerce.instagram.dto;

import java.time.LocalDateTime;

public class InstagramRefreshResponse {

    private boolean ok;
    private String message;
    private LocalDateTime expiresAt;
    private LocalDateTime refreshedAt;
    private boolean needsReconnect;

    public InstagramRefreshResponse() {
    }

    public InstagramRefreshResponse(boolean ok, String message, LocalDateTime expiresAt, LocalDateTime refreshedAt, boolean needsReconnect) {
        this.ok = ok;
        this.message = message;
        this.expiresAt = expiresAt;
        this.refreshedAt = refreshedAt;
        this.needsReconnect = needsReconnect;
    }

    public boolean isOk() {
        return ok;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public LocalDateTime getRefreshedAt() {
        return refreshedAt;
    }

    public boolean isNeedsReconnect() {
        return needsReconnect;
    }
}