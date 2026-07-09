
package com.mydev.ecommerce.shipment.controller;

import com.mydev.ecommerce.shipment.dto.ShiprocketCreateRequest;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.service.ShiprocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/shiprocket")
@RequiredArgsConstructor
public class AdminShiprocketController {

    private final ShiprocketService shiprocketService;

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ShiprocketOrderResponse> getShiprocketOrder(
            @PathVariable Long orderId
    ) {
        return shiprocketService
                .findByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .noContent()
                                .build()
                );
    }

    @PostMapping("/orders/{orderId}/create")
    public ShiprocketOrderResponse createOrContinue(
            @PathVariable Long orderId,
            @RequestBody(required = false)
            ShiprocketCreateRequest request
    ) {
        return shiprocketService
                .createOrContinue(
                        orderId,
                        request
                );
    }

    @PostMapping("/orders/{orderId}/refresh-tracking")
    public ShiprocketOrderResponse refreshTracking(
            @PathVariable Long orderId
    ) {
        return shiprocketService
                .refreshTrackingByOrderId(orderId);
    }

    @PostMapping("/tracking/refresh-open")
    public Map<String, Object> refreshOpenTracking() {
        int refreshed =
                shiprocketService
                        .refreshOpenShipmentsFromAdmin();

        return Map.of(
                "success",
                true,
                "refreshed",
                refreshed
        );
    }
}