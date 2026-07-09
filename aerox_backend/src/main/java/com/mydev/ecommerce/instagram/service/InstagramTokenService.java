


package com.mydev.ecommerce.instagram.service;

import com.mydev.ecommerce.instagram.dto.InstagramRefreshResponse;
import com.mydev.ecommerce.instagram.entity.InstagramAuth;
import com.mydev.ecommerce.instagram.repository.InstagramAuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class InstagramTokenService {

    private static final Logger log = LoggerFactory.getLogger(InstagramTokenService.class);

    private final InstagramAuthRepository instagramAuthRepository;

    @Value("${instagram.refresh-threshold-days:15}")
    private int refreshThresholdDays;

    public InstagramTokenService(InstagramAuthRepository instagramAuthRepository) {
        this.instagramAuthRepository = instagramAuthRepository;
    }

    public Optional<InstagramAuth> getActiveAuth() {
        return instagramAuthRepository.findFirstByActiveTrueOrderByIdDesc();
    }

    public InstagramAuth getActiveAuthOrThrow() {
        return getActiveAuth()
                .orElseThrow(() -> new RuntimeException("Instagram auth record not found"));
    }

    public InstagramRefreshResponse refreshIfNeeded() {
        InstagramAuth auth = getActiveAuthOrThrow();

        if (auth.isExpired()) {
            return new InstagramRefreshResponse(
                    false,
                    "Instagram token expired. Manual reconnect required.",
                    auth.getExpiresAt(),
                    auth.getRefreshedAt(),
                    true
            );
        }

        if (!auth.shouldRefresh(refreshThresholdDays)) {
            return new InstagramRefreshResponse(
                    true,
                    "Token is healthy. No refresh needed.",
                    auth.getExpiresAt(),
                    auth.getRefreshedAt(),
                    false
            );
        }

        return forceRefresh();
    }

    /**
     * Current flow only checks token state.
     * If you later add actual Instagram refresh API logic,
     * replace the body of this method.
     */
    public InstagramRefreshResponse forceRefresh() {
        InstagramAuth auth = getActiveAuthOrThrow();

        if (auth.isExpired()) {
            return new InstagramRefreshResponse(
                    false,
                    "Instagram token expired. Manual reconnect required.",
                    auth.getExpiresAt(),
                    auth.getRefreshedAt(),
                    true
            );
        }

        log.info("Instagram token check passed. expiresAt={}, refreshedAt={}",
                auth.getExpiresAt(), auth.getRefreshedAt());

        return new InstagramRefreshResponse(
                true,
                "Token is valid. No API refresh call is used for this token flow.",
                auth.getExpiresAt(),
                auth.getRefreshedAt(),
                false
        );
    }

    @Scheduled(cron = "${instagram.scheduled-refresh-cron:0 0 3 * * *}")
    public void scheduledRefresh() {
        try {
            Optional<InstagramAuth> authOpt = getActiveAuth();

            if (authOpt.isEmpty()) {
                log.info("Instagram token not configured yet.");
                return;
            }

            InstagramAuth auth = authOpt.get();

            if (auth.isExpired()) {
                log.warn("Instagram token expired. Manual reconnect required.");
                return;
            }

            if (auth.shouldRefresh(refreshThresholdDays)) {
                log.warn("Instagram token is nearing expiry. Manual reconnect recommended soon. expiresAt={}",
                        auth.getExpiresAt());
            } else {
                log.info("Instagram token health check OK. expiresAt={}", auth.getExpiresAt());
            }
        } catch (Exception e) {
            log.error("Instagram scheduled token check failed.", e);
        }
    }

    public InstagramAuth saveInitialLongLivedToken(String instagramUserId,
                                                   String longLivedAccessToken,
                                                   int expiresInSeconds) {
        LocalDateTime now = LocalDateTime.now();

        InstagramAuth existing = instagramAuthRepository
                .findFirstByActiveTrueOrderByIdDesc()
                .orElse(null);

        if (existing != null) {
            existing.setInstagramUserId(instagramUserId);
            existing.setAccessToken(longLivedAccessToken);
            existing.setExpiresAt(now.plusSeconds(expiresInSeconds));
            existing.setRefreshedAt(now);
            existing.setActive(true);

            InstagramAuth saved = instagramAuthRepository.save(existing);
            log.info("Instagram token updated successfully. expiresAt={}", saved.getExpiresAt());
            return saved;
        }

        InstagramAuth auth = new InstagramAuth();
        auth.setInstagramUserId(instagramUserId);
        auth.setAccessToken(longLivedAccessToken);
        auth.setExpiresAt(now.plusSeconds(expiresInSeconds));
        auth.setRefreshedAt(now);
        auth.setActive(true);

        InstagramAuth saved = instagramAuthRepository.save(auth);
        log.info("Instagram token created successfully. expiresAt={}", saved.getExpiresAt());
        return saved;
    }
}