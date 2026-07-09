
package com.mydev.ecommerce.shipment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.service.ShiprocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/*
 * IMPORTANT:
 * Shiprocket docs say do not use keywords like shiprocket, sr, kr
 * in the webhook URL.
 *
 * Use this public URL in Shiprocket dashboard:
 * https://your-domain.com/api/shipment-events/tracking
 */
@RestController
@RequestMapping("/api/shipment-events")
@RequiredArgsConstructor
public class ShiprocketWebhookController {

    private final ShiprocketService shiprocketService;

    @PostMapping("/tracking")
    public ResponseEntity<Map<String, Object>> handleTrackingWebhook(
            @RequestBody JsonNode payload,
            @RequestHeader(
                    value = "x-api-key",
                    required = false
            ) String apiKey
    ) {
        try {
            Optional<ShiprocketOrderResponse> response =
                    shiprocketService
                            .processTrackingWebhook(
                                    payload,
                                    apiKey
                            );

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,
                            "matched",
                            response.isPresent()
                    )
            );

        } catch (ShiprocketService.InvalidWebhookSecretException exception) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "matched",
                                    false,
                                    "message",
                                    "Invalid webhook secret"
                            )
                    );
        }
    }
}