
// package com.mydev.ecommerce.shipment.client;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.http.HttpHeaders;
// import org.springframework.stereotype.Component;
// import org.springframework.web.client.RestClient;
// import org.springframework.web.client.RestClientResponseException;

// import java.time.OffsetDateTime;
// import java.util.LinkedHashMap;
// import java.util.List;
// import java.util.Map;

// @Slf4j
// @Component
// @RequiredArgsConstructor
// public class ShiprocketClient {

//     private final RestClient shiprocketRestClient;

//     private final ShiprocketProperties properties;

//     private volatile String cachedToken;

//     private volatile OffsetDateTime cachedTokenExpiresAt;

//     public JsonNode createOrder(
//             Map<String, Object> payload
//     ) {
//         return postWithAuth(
//                 "/v1/external/orders/create/adhoc",
//                 payload
//         );
//     }

//     public JsonNode assignAwb(
//             Long shipmentId,
//             Integer courierId
//     ) {
//         if (shipmentId == null) {
//             throw new RuntimeException(
//                     "Shiprocket shipment id is required for AWB assignment"
//             );
//         }

//         Map<String, Object> payload =
//                 new LinkedHashMap<>();

//         payload.put(
//                 "shipment_id",
//                 shipmentId
//         );

//         if (courierId != null) {
//             payload.put(
//                     "courier_id",
//                     courierId
//             );
//         }

//         return postWithAuth(
//                 "/v1/external/courier/assign/awb",
//                 payload
//         );
//     }

//     public JsonNode generatePickup(
//             Long shipmentId
//     ) {
//         if (shipmentId == null) {
//             throw new RuntimeException(
//                     "Shiprocket shipment id is required for pickup generation"
//             );
//         }

//         Map<String, Object> payload =
//                 new LinkedHashMap<>();

//         payload.put(
//                 "shipment_id",
//                 List.of(shipmentId)
//         );

//         return postWithAuth(
//                 "/v1/external/courier/generate/pickup",
//                 payload
//         );
//     }

//     public JsonNode trackByAwb(
//             String awbCode
//     ) {
//         if (isBlank(awbCode)) {
//             throw new RuntimeException(
//                     "AWB code is required for Shiprocket tracking"
//             );
//         }

//         return getWithAuth(
//                 "/v1/external/courier/track/awb/{awbCode}",
//                 awbCode.trim()
//         );
//     }

//     private JsonNode postWithAuth(
//             String path,
//             Object payload
//     ) {
//         String token =
//                 getValidToken();

//         try {
//             JsonNode response =
//                     shiprocketRestClient
//                             .post()
//                             .uri(path)
//                             .header(
//                                     HttpHeaders.AUTHORIZATION,
//                                     "Bearer " + token
//                             )
//                             .body(payload)
//                             .retrieve()
//                             .body(JsonNode.class);

//             if (response == null) {
//                 throw new RuntimeException(
//                         "Shiprocket returned empty response"
//                 );
//             }

//             return response;

//         } catch (RestClientResponseException exception) {
//             throw shiprocketApiException(
//                     path,
//                     exception
//             );
//         }
//     }

//     private JsonNode getWithAuth(
//             String path,
//             Object... uriVariables
//     ) {
//         String token =
//                 getValidToken();

//         try {
//             JsonNode response =
//                     shiprocketRestClient
//                             .get()
//                             .uri(
//                                     path,
//                                     uriVariables
//                             )
//                             .header(
//                                     HttpHeaders.AUTHORIZATION,
//                                     "Bearer " + token
//                             )
//                             .retrieve()
//                             .body(JsonNode.class);

//             if (response == null) {
//                 throw new RuntimeException(
//                         "Shiprocket returned empty response"
//                 );
//             }

//             return response;

//         } catch (RestClientResponseException exception) {
//             throw shiprocketApiException(
//                     path,
//                     exception
//             );
//         }
//     }

//     private String getValidToken() {
//         OffsetDateTime now =
//                 OffsetDateTime.now();

//         if (
//                 !isBlank(cachedToken)
//                         && cachedTokenExpiresAt != null
//                         && cachedTokenExpiresAt.isAfter(now.plusMinutes(5))
//         ) {
//             return cachedToken;
//         }

//         synchronized (this) {
//             now =
//                     OffsetDateTime.now();

//             if (
//                     !isBlank(cachedToken)
//                             && cachedTokenExpiresAt != null
//                             && cachedTokenExpiresAt.isAfter(now.plusMinutes(5))
//             ) {
//                 return cachedToken;
//             }

//             return loginAndCacheToken();
//         }
//     }

//     private String loginAndCacheToken() {
//         if (isBlank(properties.getEmail())) {
//             throw new RuntimeException(
//                     "SHIPROCKET_EMAIL is missing"
//             );
//         }

//         if (isBlank(properties.getPassword())) {
//             throw new RuntimeException(
//                     "SHIPROCKET_PASSWORD is missing"
//             );
//         }

//         Map<String, Object> payload =
//                 new LinkedHashMap<>();

//         payload.put(
//                 "email",
//                 properties.getEmail().trim()
//         );

//         payload.put(
//                 "password",
//                 properties.getPassword().trim()
//         );

//         try {
//             JsonNode response =
//                     shiprocketRestClient
//                             .post()
//                             .uri("/v1/external/auth/login")
//                             .body(payload)
//                             .retrieve()
//                             .body(JsonNode.class);

//             if (response == null) {
//                 throw new RuntimeException(
//                         "Shiprocket auth returned empty response"
//                 );
//             }

//             String token =
//                     response
//                             .path("token")
//                             .asText(null);

//             if (isBlank(token)) {
//                 throw new RuntimeException(
//                         "Shiprocket auth token missing. Response: " + response
//                 );
//             }

//             cachedToken =
//                     token.trim();

//             long tokenValidHours =
//                     Math.max(
//                             1,
//                             properties.getTokenValidHours()
//                     );

//             cachedTokenExpiresAt =
//                     OffsetDateTime
//                             .now()
//                             .plusHours(tokenValidHours);

//             log.info(
//                     "Shiprocket auth token refreshed successfully"
//             );

//             return cachedToken;

//         } catch (RestClientResponseException exception) {
//             throw shiprocketApiException(
//                     "/v1/external/auth/login",
//                     exception
//             );
//         }
//     }

//     private RuntimeException shiprocketApiException(
//             String path,
//             RestClientResponseException exception
//     ) {
//         String responseBody =
//                 exception.getResponseBodyAsString();

//         String message =
//                 "Shiprocket API failed. path="
//                         + path
//                         + ", status="
//                         + exception.getStatusCode()
//                         + ", response="
//                         + responseBody;

//         log.warn(
//                 message
//         );

//         return new RuntimeException(
//                 message,
//                 exception
//         );
//     }

//     private boolean isBlank(
//             String value
//     ) {
//         return value == null
//                 || value.isBlank();
//     }
// }

































package com.mydev.ecommerce.shipment.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShiprocketClient {

    private final RestClient shiprocketRestClient;

    private final ShiprocketProperties properties;

    private volatile String cachedToken;

    private volatile OffsetDateTime cachedTokenExpiresAt;

    public JsonNode createOrder(
            Map<String, Object> payload
    ) {
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
            throw new RuntimeException(
                    "Shiprocket shipment id is required for AWB assignment"
            );
        }

        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "shipment_id",
                shipmentId
        );

        if (courierId != null) {
            payload.put(
                    "courier_id",
                    courierId
            );
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
            throw new RuntimeException(
                    "Shiprocket shipment id is required for pickup generation"
            );
        }

        Map<String, Object> payload =
                new LinkedHashMap<>();

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
            throw new RuntimeException(
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
        String token =
                getValidToken();

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

                String refreshedToken =
                        getValidToken();

                try {
                    return postWithBearerToken(
                            path,
                            payload,
                            refreshedToken
                    );

                } catch (RestClientResponseException retryException) {
                    throw shiprocketApiException(
                            path,
                            retryException
                    );
                }
            }

            throw shiprocketApiException(
                    path,
                    exception
            );
        }
    }

    private JsonNode getWithAuth(
            String path,
            Object... uriVariables
    ) {
        String token =
                getValidToken();

        try {
            return getWithBearerToken(
                    path,
                    token,
                    uriVariables
            );

        } catch (RestClientResponseException exception) {
            if (isAuthFailure(exception)) {
                log.warn(
                        "Shiprocket token rejected. Refreshing token and retrying once. path={}, status={}",
                        path,
                        exception.getStatusCode()
                );

                clearCachedToken();

                String refreshedToken =
                        getValidToken();

                try {
                    return getWithBearerToken(
                            path,
                            refreshedToken,
                            uriVariables
                    );

                } catch (RestClientResponseException retryException) {
                    throw shiprocketApiException(
                            path,
                            retryException
                    );
                }
            }

            throw shiprocketApiException(
                    path,
                    exception
            );
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
            throw new RuntimeException(
                    "Shiprocket returned empty response"
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
            throw new RuntimeException(
                    "Shiprocket returned empty response"
            );
        }

        return response;
    }

    private String getValidToken() {
        OffsetDateTime now =
                OffsetDateTime.now();

        if (
                !isBlank(cachedToken)
                        && cachedTokenExpiresAt != null
                        && cachedTokenExpiresAt.isAfter(now.plusMinutes(5))
        ) {
            return cachedToken;
        }

        synchronized (this) {
            now =
                    OffsetDateTime.now();

            if (
                    !isBlank(cachedToken)
                            && cachedTokenExpiresAt != null
                            && cachedTokenExpiresAt.isAfter(now.plusMinutes(5))
            ) {
                return cachedToken;
            }

            return loginAndCacheToken();
        }
    }

    private String loginAndCacheToken() {
        if (isBlank(properties.getEmail())) {
            throw new RuntimeException(
                    "SHIPROCKET_EMAIL is missing"
            );
        }

        if (isBlank(properties.getPassword())) {
            throw new RuntimeException(
                    "SHIPROCKET_PASSWORD is missing"
            );
        }

        Map<String, Object> payload =
                new LinkedHashMap<>();

        payload.put(
                "email",
                properties.getEmail().trim()
        );

        payload.put(
                "password",
                properties.getPassword().trim()
        );

        try {
            JsonNode response =
                    shiprocketRestClient
                            .post()
                            .uri("/v1/external/auth/login")
                            .body(payload)
                            .retrieve()
                            .body(JsonNode.class);

            if (response == null) {
                throw new RuntimeException(
                        "Shiprocket auth returned empty response"
                );
            }

            String token =
                    response
                            .path("token")
                            .asText(null);

            if (isBlank(token)) {
                throw new RuntimeException(
                        "Shiprocket auth token missing. Response: " + response
                );
            }

            cachedToken =
                    token.trim();

            long tokenValidHours =
                    Math.max(
                            1,
                            properties.getTokenValidHours()
                    );

            cachedTokenExpiresAt =
                    OffsetDateTime
                            .now()
                            .plusHours(tokenValidHours);

            log.info(
                    "Shiprocket auth token refreshed successfully"
            );

            return cachedToken;

        } catch (RestClientResponseException exception) {
            clearCachedToken();

            throw shiprocketApiException(
                    "/v1/external/auth/login",
                    exception
            );
        }
    }

    private void clearCachedToken() {
        synchronized (this) {
            cachedToken =
                    null;

            cachedTokenExpiresAt =
                    null;
        }
    }

    private boolean isAuthFailure(
            RestClientResponseException exception
    ) {
        if (exception == null || exception.getStatusCode() == null) {
            return false;
        }

        int statusCode =
                exception
                        .getStatusCode()
                        .value();

        return statusCode == 401
                || statusCode == 403;
    }

    private RuntimeException shiprocketApiException(
            String path,
            RestClientResponseException exception
    ) {
        String responseBody =
                exception.getResponseBodyAsString();

        String message =
                "Shiprocket API failed. path="
                        + path
                        + ", status="
                        + exception.getStatusCode()
                        + ", response="
                        + responseBody;

        log.warn(
                message
        );

        return new RuntimeException(
                message,
                exception
        );
    }

    private boolean isBlank(
            String value
    ) {
        return value == null
                || value.isBlank();
    }
}