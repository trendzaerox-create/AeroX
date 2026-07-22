package com.mydev.ecommerce.shipment.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShiprocketClient {

    private static final int MAX_ERROR_BODY_CHARS = 20000;

    private final RestClient shiprocketRestClient;

    private final ShiprocketProperties properties;

    private volatile String cachedToken;

    private volatile OffsetDateTime cachedTokenExpiresAt;

    public JsonNode createOrder(
            Map<String, Object> payload
    ) {
        /*
         * Creating an order is not automatically retried on network/5xx errors.
         * A retry after an ambiguous failure could create a duplicate external
         * order. The admin can safely call createOrContinue again using the same
         * ecommerce order reference.
         */
        return postWithAuth(
                "/v1/external/orders/create/adhoc",
                payload
        );
    }

    public JsonNode assignAwb(
            Long shipmentId,
            Integer courierId
    ) {
        if (shipmentId == null) {
            throw new IllegalArgumentException(
                    "Shiprocket shipment id is required for AWB assignment"
            );
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("shipment_id", shipmentId);

        if (courierId != null) {
            payload.put("courier_id", courierId);
        }

        return postWithAuth(
                "/v1/external/courier/assign/awb",
                payload
        );
    }

    public JsonNode generatePickup(
            Long shipmentId
    ) {
        if (shipmentId == null) {
            throw new IllegalArgumentException(
                    "Shiprocket shipment id is required for pickup generation"
            );
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put(
                "shipment_id",
                List.of(shipmentId)
        );

        return postWithAuth(
                "/v1/external/courier/generate/pickup",
                payload
        );
    }

    public JsonNode trackByAwb(
            String awbCode
    ) {
        if (isBlank(awbCode)) {
            throw new IllegalArgumentException(
                    "AWB code is required for Shiprocket tracking"
            );
        }

        return getWithAuth(
                "/v1/external/courier/track/awb/{awbCode}",
                awbCode.trim()
        );
    }

    private JsonNode postWithAuth(
            String path,
            Object payload
    ) {
        String token = getValidToken();

        try {
            return postWithBearerToken(
                    path,
                    payload,
                    token
            );

        } catch (RestClientResponseException exception) {
            if (isAuthFailure(exception)) {
                log.warn(
                        "Shiprocket token rejected. Refreshing token and retrying once. path={}, status={}",
                        path,
                        exception.getStatusCode()
                );

                clearCachedToken();

                try {
                    return postWithBearerToken(
                            path,
                            payload,
                            getValidToken()
                    );

                } catch (RestClientResponseException retryException) {
                    throw shiprocketApiException(
                            path,
                            retryException
                    );

                } catch (RestClientException retryException) {
                    throw shiprocketTransportException(
                            path,
                            retryException
                    );
                }
            }

            throw shiprocketApiException(
                    path,
                    exception
            );

        } catch (RestClientException exception) {
            throw shiprocketTransportException(
                    path,
                    exception
            );
        }
    }

    private JsonNode getWithAuth(
            String path,
            Object... uriVariables
    ) {
        String token = getValidToken();
        boolean authRetried = false;
        boolean transientRetried = false;

        while (true) {
            try {
                return getWithBearerToken(
                        path,
                        token,
                        uriVariables
                );

            } catch (RestClientResponseException exception) {
                if (
                        isAuthFailure(exception)
                                && !authRetried
                ) {
                    authRetried = true;
                    clearCachedToken();
                    token = getValidToken();
                    continue;
                }

                if (
                        isTransientFailure(exception)
                                && !transientRetried
                ) {
                    transientRetried = true;
                    pauseBeforeRetry(exception);
                    continue;
                }

                throw shiprocketApiException(
                        path,
                        exception
                );

            } catch (RestClientException exception) {
                if (!transientRetried) {
                    transientRetried = true;
                    pauseBeforeRetry(null);
                    continue;
                }

                throw shiprocketTransportException(
                        path,
                        exception
                );
            }
        }
    }

    private JsonNode postWithBearerToken(
            String path,
            Object payload,
            String token
    ) {
        JsonNode response =
                shiprocketRestClient
                        .post()
                        .uri(path)
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + token
                        )
                        .body(payload)
                        .retrieve()
                        .body(JsonNode.class);

        if (response == null) {
            throw new ShiprocketApiException(
                    path,
                    0,
                    null,
                    new IllegalStateException(
                            "Shiprocket returned an empty response"
                    )
            );
        }

        return response;
    }

    private JsonNode getWithBearerToken(
            String path,
            String token,
            Object... uriVariables
    ) {
        JsonNode response =
                shiprocketRestClient
                        .get()
                        .uri(
                                path,
                                uriVariables
                        )
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + token
                        )
                        .retrieve()
                        .body(JsonNode.class);

        if (response == null) {
            throw new ShiprocketApiException(
                    path,
                    0,
                    null,
                    new IllegalStateException(
                            "Shiprocket returned an empty response"
                    )
            );
        }

        return response;
    }

    private String getValidToken() {
        OffsetDateTime now = OffsetDateTime.now();

        if (
                !isBlank(cachedToken)
                        && cachedTokenExpiresAt != null
                        && cachedTokenExpiresAt.isAfter(
                        now.plusMinutes(5)
                )
        ) {
            return cachedToken;
        }

        synchronized (this) {
            now = OffsetDateTime.now();

            if (
                    !isBlank(cachedToken)
                            && cachedTokenExpiresAt != null
                            && cachedTokenExpiresAt.isAfter(
                            now.plusMinutes(5)
                    )
            ) {
                return cachedToken;
            }

            return loginAndCacheToken();
        }
    }

    private String loginAndCacheToken() {
        if (isBlank(properties.getEmail())) {
            throw new IllegalStateException(
                    "SHIPROCKET_EMAIL is missing"
            );
        }

        if (isBlank(properties.getPassword())) {
            throw new IllegalStateException(
                    "SHIPROCKET_PASSWORD is missing"
            );
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("email", properties.getEmail().trim());

        /* Do not trim passwords; valid passwords may contain spaces. */
        payload.put("password", properties.getPassword());

        boolean retried = false;

        while (true) {
            try {
                JsonNode response =
                        shiprocketRestClient
                                .post()
                                .uri("/v1/external/auth/login")
                                .body(payload)
                                .retrieve()
                                .body(JsonNode.class);

                if (response == null) {
                    throw new IllegalStateException(
                            "Shiprocket authentication returned an empty response"
                    );
                }

                String token = response.path("token").asText(null);

                if (isBlank(token)) {
                    throw new IllegalStateException(
                            "Shiprocket authentication token is missing"
                    );
                }

                cachedToken = token.trim();
                cachedTokenExpiresAt =
                        OffsetDateTime
                                .now()
                                .plusHours(
                                        Math.max(
                                                1,
                                                properties.getTokenValidHours()
                                        )
                                );

                log.info("Shiprocket authentication token refreshed successfully");
                return cachedToken;

            } catch (RestClientResponseException exception) {
                clearCachedToken();

                if (
                        isTransientFailure(exception)
                                && !retried
                ) {
                    retried = true;
                    pauseBeforeRetry(exception);
                    continue;
                }

                throw shiprocketApiException(
                        "/v1/external/auth/login",
                        exception
                );

            } catch (RestClientException exception) {
                clearCachedToken();

                if (!retried) {
                    retried = true;
                    pauseBeforeRetry(null);
                    continue;
                }

                throw shiprocketTransportException(
                        "/v1/external/auth/login",
                        exception
                );
            }
        }
    }

    private void clearCachedToken() {
        synchronized (this) {
            cachedToken = null;
            cachedTokenExpiresAt = null;
        }
    }

    private boolean isAuthFailure(
            RestClientResponseException exception
    ) {
        if (
                exception == null
                        || exception.getStatusCode() == null
        ) {
            return false;
        }

        int statusCode = exception.getStatusCode().value();
        return statusCode == 401 || statusCode == 403;
    }

    private boolean isTransientFailure(
            RestClientResponseException exception
    ) {
        if (
                exception == null
                        || exception.getStatusCode() == null
        ) {
            return false;
        }

        int statusCode = exception.getStatusCode().value();
        return statusCode == 429 || statusCode >= 500;
    }

    private void pauseBeforeRetry(
            RestClientResponseException exception
    ) {
        long delayMs = 500;

        if (
                exception != null
                        && exception.getResponseHeaders() != null
        ) {
            String retryAfter =
                    exception
                            .getResponseHeaders()
                            .getFirst(HttpHeaders.RETRY_AFTER);

            if (!isBlank(retryAfter)) {
                try {
                    delayMs = Math.min(
                            2000,
                            Math.max(
                                    250,
                                    Long.parseLong(retryAfter.trim()) * 1000
                            )
                    );

                } catch (NumberFormatException ignored) {
                    delayMs = 500;
                }
            }
        }

        try {
            Thread.sleep(delayMs);

        } catch (InterruptedException exceptionInterrupted) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Shiprocket retry was interrupted",
                    exceptionInterrupted
            );
        }
    }

    private ShiprocketApiException shiprocketApiException(
            String path,
            RestClientResponseException exception
    ) {
        int statusCode =
                exception.getStatusCode() != null
                        ? exception.getStatusCode().value()
                        : 0;

        String responseBody =
                truncate(
                        exception.getResponseBodyAsString(),
                        MAX_ERROR_BODY_CHARS
                );

        log.warn(
                "Shiprocket API failed. path={}, status={}",
                path,
                statusCode
        );

        return new ShiprocketApiException(
                path,
                statusCode,
                responseBody,
                exception
        );
    }

    private ShiprocketApiException shiprocketTransportException(
            String path,
            RestClientException exception
    ) {
        log.warn(
                "Shiprocket API transport failure. path={}, exception={}",
                path,
                exception.getClass().getSimpleName()
        );

        return new ShiprocketApiException(
                path,
                0,
                null,
                exception
        );
    }

    private String truncate(
            String value,
            int max
    ) {
        if (value == null || value.length() <= max) {
            return value;
        }

        return value.substring(0, max);
    }

    private boolean isBlank(
            String value
    ) {
        return value == null || value.isBlank();
    }

    public static class ShiprocketApiException extends RuntimeException {

        private final String path;

        private final int statusCode;

        private final String responseBody;

        public ShiprocketApiException(
                String path,
                int statusCode,
                String responseBody,
                Throwable cause
        ) {
            super(
                    "Shiprocket API request failed. path="
                            + path
                            + ", status="
                            + statusCode,
                    cause
            );

            this.path = path;
            this.statusCode = statusCode;
            this.responseBody = responseBody;
        }

        public String getPath() {
            return path;
        }

        public int getStatusCode() {
            return statusCode;
        }

        public String getResponseBody() {
            return responseBody;
        }
    }
}
