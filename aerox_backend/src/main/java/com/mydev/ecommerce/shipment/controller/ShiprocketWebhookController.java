package com.mydev.ecommerce.shipment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.service.ShiprocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

/*
 * Shiprocket advises against using shiprocket, sr, kr or kartrocket in the
 * public webhook URL. Configure this URL in the Shiprocket dashboard:
 * https://api.trendzaerox.com/api/shipment-events/tracking
 */
@RestController
@RequestMapping("/api/shipment-events")
@RequiredArgsConstructor
public class ShiprocketWebhookController {

    private final ShiprocketService shiprocketService;

    @PostMapping(
            value = "/tracking",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
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
