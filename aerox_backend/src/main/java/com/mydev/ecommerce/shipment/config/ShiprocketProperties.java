package com.mydev.ecommerce.shipment.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.shiprocket")
public class ShiprocketProperties {

    private boolean enabled = false;

    private String baseUrl = "https://apiv2.shiprocket.in";

    private String email;

    private String password;

    /*
     * Must exactly match the pickup location name configured in Shiprocket.
     */
    private String pickupLocation = "Primary";

    @DecimalMin(value = "0.50")
    private BigDecimal defaultLengthCm = new BigDecimal("10.00");

    @DecimalMin(value = "0.50")
    private BigDecimal defaultBreadthCm = new BigDecimal("10.00");

    @DecimalMin(value = "0.50")
    private BigDecimal defaultHeightCm = new BigDecimal("5.00");

    @DecimalMin(value = "0.01")
    private BigDecimal defaultWeightKg = new BigDecimal("0.50");

    /*
     * Shiprocket responses currently provide links such as
     * https://shiprocket.co/tracking/{awb}. The API-provided track_url is
     * always preferred; this value is only a fallback.
     */
    private String trackingBaseUrl = "https://shiprocket.co/tracking";

    /*
     * Shiprocket documents token validity as 240 hours (10 days). Refreshing
     * after 230 hours leaves a safety margin.
     */
    @Min(1)
    @Max(239)
    private long tokenValidHours = 230;

    @Min(1000)
    private long connectTimeoutMs = 10000;

    @Min(1000)
    private long readTimeoutMs = 30000;

    /*
     * Same value configured in Shiprocket Dashboard webhook Security Token.
     * Shiprocket sends it in the x-api-key request header.
     */
    private String webhookSecret;

    /*
     * Prevent provider payload history columns from growing without limit.
     */
    @Min(1)
    @Max(100)
    private int maxStoredEvents = 25;

    @Min(1000)
    @Max(1000000)
    private int maxStoredPayloadChars = 250000;

    @Valid
    private TrackingRefresh trackingRefresh = new TrackingRefresh();

    @AssertTrue(
            message = "Shiprocket email, password, pickup location and webhook secret are required when Shiprocket is enabled"
    )
    public boolean isProductionConfigurationComplete() {
        return !enabled
                || (
                hasText(email)
                        && hasText(password)
                        && hasText(pickupLocation)
                        && hasText(webhookSecret)
        );
    }

    private boolean hasText(
            String value
    ) {
        return value != null && !value.isBlank();
    }

    @Getter
    @Setter
    public static class TrackingRefresh {

        private boolean enabled = true;

        @Min(60000)
        private long fixedDelayMs = 1800000;

        @Min(0)
        private long initialDelayMs = 120000;

        @Min(1)
        @Max(50)
        private int batchSize = 25;
    }
}
