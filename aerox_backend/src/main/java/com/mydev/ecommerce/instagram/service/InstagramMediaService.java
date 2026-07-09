


package com.mydev.ecommerce.instagram.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mydev.ecommerce.instagram.dto.InstagramMediaItemDto;
import com.mydev.ecommerce.instagram.dto.InstagramPostDto;
import com.mydev.ecommerce.instagram.entity.InstagramAuth;
import com.mydev.ecommerce.instagram.entity.InstagramMediaCache;
import com.mydev.ecommerce.instagram.repository.InstagramMediaCacheRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InstagramMediaService {

    private static final Logger log = LoggerFactory.getLogger(InstagramMediaService.class);
    private static final String CACHE_KEY = "latest_posts";

    private final InstagramTokenService instagramTokenService;
    private final InstagramMediaCacheRepository cacheRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${instagram.graph-version:v25.0}")
    private String graphVersion;

    @Value("${instagram.app-secret}")
    private String appSecret;

    @Value("${instagram.cache.refresh-limit:20}")
    private int cacheRefreshLimit;

    public InstagramMediaService(
            InstagramTokenService instagramTokenService,
            InstagramMediaCacheRepository cacheRepository,
            RestTemplate restTemplate,
            ObjectMapper objectMapper
    ) {
        this.instagramTokenService = instagramTokenService;
        this.cacheRepository = cacheRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<InstagramPostDto> getLatestMediaPosts(int limit) {
        List<InstagramPostDto> cached = readCache();

        if (!cached.isEmpty()) {
            return cached.stream().limit(limit).toList();
        }

        try {
            List<InstagramPostDto> fresh = fetchFromInstagram(Math.max(limit, cacheRefreshLimit));
            saveCache(fresh);
            return fresh.stream().limit(limit).toList();
        } catch (Exception e) {
            log.error("Instagram fetch failed and cache is empty.", e);
            throw new RuntimeException("Instagram fetch failed and cache is empty.", e);
        }
    }

    public List<InstagramPostDto> refreshCacheNow() {
        List<InstagramPostDto> fresh = fetchFromInstagram(cacheRefreshLimit);
        saveCache(fresh);
        log.info("Instagram media cache refreshed manually. items={}", fresh.size());
        return fresh;
    }

    @Scheduled(cron = "${instagram.media-refresh-cron:0 */20 * * * *}")
    public void scheduledMediaRefresh() {
        try {
            Optional<InstagramAuth> authOpt = instagramTokenService.getActiveAuth();

            if (authOpt.isEmpty()) {
                log.info("Instagram media refresh skipped. No active auth configured.");
                return;
            }

            InstagramAuth auth = authOpt.get();

            if (auth.isExpired()) {
                log.warn("Instagram media refresh skipped. Token expired.");
                return;
            }

            List<InstagramPostDto> fresh = fetchFromInstagram(cacheRefreshLimit);
            saveCache(fresh);

            log.info("Instagram media cache auto-refreshed successfully. items={}, updatedAt={}",
                    fresh.size(), LocalDateTime.now());

        } catch (Exception e) {
            LocalDateTime cachedAt = getCacheUpdatedAt();
            if (cachedAt != null) {
                log.warn("Instagram media refresh failed. Existing cache will continue to serve. cacheUpdatedAt={}",
                        cachedAt, e);
            } else {
                log.error("Instagram media refresh failed and no cache is available.", e);
            }
        }
    }

    public LocalDateTime getCacheUpdatedAt() {
        return cacheRepository.findByCacheKey(CACHE_KEY)
                .map(InstagramMediaCache::getUpdatedAt)
                .orElse(null);
    }

    private List<InstagramPostDto> readCache() {
        try {
            return cacheRepository.findByCacheKey(CACHE_KEY)
                    .map(cache -> {
                        try {
                            String payload = cache.getPayloadJson();

                            if (payload == null || payload.isBlank()) {
                                return new ArrayList<InstagramPostDto>();
                            }

                            JsonNode root = objectMapper.readTree(payload);

                            if (!root.isArray()) {
                                log.warn("Invalid Instagram cache payload. Expected JSON array.");
                                return new ArrayList<InstagramPostDto>();
                            }

                            return objectMapper.readValue(
                                    payload,
                                    new TypeReference<List<InstagramPostDto>>() {}
                            );
                        } catch (Exception e) {
                            log.error("Failed to parse Instagram cache.", e);
                            return new ArrayList<InstagramPostDto>();
                        }
                    })
                    .orElseGet(ArrayList::new);
        } catch (Exception e) {
            log.error("Instagram cache read failed.", e);
            return new ArrayList<>();
        }
    }

    private void saveCache(List<InstagramPostDto> posts) {
        try {
            InstagramMediaCache cache = cacheRepository.findByCacheKey(CACHE_KEY)
                    .orElseGet(InstagramMediaCache::new);

            cache.setCacheKey(CACHE_KEY);
            cache.setPayloadJson(objectMapper.writeValueAsString(posts));
            cache.setUpdatedAt(LocalDateTime.now());

            cacheRepository.save(cache);
        } catch (Exception e) {
            log.error("Failed to save Instagram cache.", e);
            throw new RuntimeException("Failed to save Instagram cache.", e);
        }
    }

    private List<InstagramPostDto> fetchFromInstagram(int limit) {
        InstagramAuth auth = instagramTokenService.getActiveAuthOrThrow();

        if (auth.isExpired()) {
            throw new RuntimeException("Instagram token expired. Manual reconnect required.");
        }

        // String appSecretProof = createAppSecretProof(auth.getAccessToken(), appSecret);

        // String url = UriComponentsBuilder
        //         .fromHttpUrl("https://graph.facebook.com/" + graphVersion + "/" + auth.getInstagramUserId() + "/media")
        //         .queryParam("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,alt_text")
        //         .queryParam("access_token", auth.getAccessToken())
        //         .queryParam("appsecret_proof", appSecretProof)
        //         .queryParam("limit", limit)
        //         .toUriString();



        String url = UriComponentsBuilder
        .fromHttpUrl("https://graph.instagram.com/me/media")
        .queryParam("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp")
        .queryParam("access_token", auth.getAccessToken())
        .queryParam("limit", limit)
        .toUriString();




        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode data = root.get("data");

            List<InstagramPostDto> posts = new ArrayList<>();

            if (data != null && data.isArray()) {
                for (JsonNode item : data) {
                    String mediaType = item.path("media_type").asText("");

                    if (!"IMAGE".equals(mediaType)
                            && !"CAROUSEL_ALBUM".equals(mediaType)
                            && !"VIDEO".equals(mediaType)) {
                        continue;
                    }

                    String id = item.path("id").asText("");
                    String caption = item.path("caption").asText("");
                    String mediaUrl = item.path("media_url").asText("");
                    String thumbnailUrl = item.path("thumbnail_url").asText("");
                    String permalink = item.path("permalink").asText("");
                    String timestamp = item.path("timestamp").asText("");
                    String altText = item.path("alt_text").asText("");

                    if (altText == null || altText.isBlank()) {
                        altText = (caption != null && !caption.isBlank())
                                ? caption
                                : "Trendz AeroX Instagram post";
                    }

                    boolean isVideo = "VIDEO".equals(mediaType);
                    boolean isCarousel = "CAROUSEL_ALBUM".equals(mediaType);

                    List<InstagramMediaItemDto> items;

                    if (isCarousel) {
                     items = fetchCarouselChildren(id, auth.getAccessToken(), altText);

                        if (items.isEmpty() && mediaUrl != null && !mediaUrl.isBlank()) {
                            items.add(new InstagramMediaItemDto(
                                    id,
                                    "IMAGE",
                                    mediaUrl,
                                    thumbnailUrl,
                                    altText,
                                    false
                            ));
                        }
                    } else {
                        items = new ArrayList<>();
                        items.add(new InstagramMediaItemDto(
                                id,
                                mediaType,
                                mediaUrl,
                                thumbnailUrl,
                                altText,
                                isVideo
                        ));
                    }

                    posts.add(new InstagramPostDto(
                            id,
                            caption,
                            mediaType,
                            mediaUrl,
                            thumbnailUrl,
                            permalink,
                            timestamp,
                            altText,
                            isVideo,
                            isCarousel,
                            items
                    ));

                    if (posts.size() >= limit) {
                        break;
                    }
                }
            }

            return posts;

        } catch (HttpStatusCodeException e) {
            String message = "Failed to fetch Instagram posts";
            try {
                JsonNode errorRoot = objectMapper.readTree(e.getResponseBodyAsString());
                if (errorRoot.has("error") && errorRoot.get("error").has("message")) {
                    message = errorRoot.get("error").get("message").asText();
                }
            } catch (Exception ignored) {
            }

            throw new RuntimeException(message, e);

        } catch (Exception e) {
            throw new RuntimeException(
                    e.getMessage() != null ? e.getMessage() : "Unexpected Instagram fetch error",
                    e
            );
        }
    }

    private List<InstagramMediaItemDto> fetchCarouselChildren(
        String mediaId,
        String accessToken,
        String altText
) {
        List<InstagramMediaItemDto> items = new ArrayList<>();

        String childrenUrl = UriComponentsBuilder
        .fromHttpUrl("https://graph.instagram.com/" + mediaId + "/children")
        .queryParam("fields", "id,media_type,media_url,thumbnail_url")
        .queryParam("access_token", accessToken)
        .toUriString();

        try {
            String childrenResponse = restTemplate.getForObject(childrenUrl, String.class);
            JsonNode childrenRoot = objectMapper.readTree(childrenResponse);
            JsonNode childrenData = childrenRoot.get("data");

            if (childrenData != null && childrenData.isArray()) {
                for (JsonNode child : childrenData) {
                    String childId = child.path("id").asText("");
                    String childMediaType = child.path("media_type").asText("");
                    String childMediaUrl = child.path("media_url").asText("");
                    String childThumbnailUrl = child.path("thumbnail_url").asText("");
                    boolean childVideo = "VIDEO".equals(childMediaType);

                    if (!"IMAGE".equals(childMediaType) && !"VIDEO".equals(childMediaType)) {
                        continue;
                    }

                    items.add(new InstagramMediaItemDto(
                            childId,
                            childMediaType,
                            childMediaUrl,
                            childThumbnailUrl,
                            altText,
                            childVideo
                    ));
                }
            }

            return items;
        } catch (Exception e) {
            log.warn("Failed to fetch Instagram carousel children for mediaId={}", mediaId, e);
            return items;
        }
    }

    private String createAppSecretProof(String token, String appSecret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    appSecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(secretKeySpec);
            byte[] digest = mac.doFinal(token.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : digest) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) {
                    hex.append('0');
                }
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate appsecret_proof", e);
        }
    }
}