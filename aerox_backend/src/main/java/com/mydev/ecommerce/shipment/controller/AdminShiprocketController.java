package com.mydev.ecommerce.shipment.controller;

import com.mydev.ecommerce.shipment.dto.ShiprocketCreateRequest;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.service.ShiprocketService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/shiprocket")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminShiprocketController {

    private final ShiprocketService shiprocketService;

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ShiprocketOrderResponse> getShiprocketOrder(
            @PathVariable @Positive Long orderId
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
            @PathVariable @Positive Long orderId,
            @Valid @RequestBody(required = false)
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
            @PathVariable @Positive Long orderId
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
