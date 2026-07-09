
package com.mydev.ecommerce.shipment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.shiprocket")
public class ShiprocketProperties {

    private boolean enabled = false;

    private String baseUrl = "https://apiv2.shiprocket.in";

    private String email;

    private String password;

    /*
     * This must exactly match the pickup location name configured
     * inside your Shiprocket dashboard.
     */
    private String pickupLocation = "Primary";

    private BigDecimal defaultLengthCm = new BigDecimal("10.00");

    private BigDecimal defaultBreadthCm = new BigDecimal("10.00");

    private BigDecimal defaultHeightCm = new BigDecimal("5.00");

    private BigDecimal defaultWeightKg = new BigDecimal("0.50");

    /*
     * Public tracking page base.
     * Final URL becomes: trackingBaseUrl + "/" + awbCode
     */
    private String trackingBaseUrl = "https://shiprocket.co/tracking";

    /*
     * Shiprocket auth token validity is long-lived, but this integration
     * refreshes safely before expiry.
     */
    private long tokenValidHours = 230;

    /*
     * Same value you add in Shiprocket Dashboard:
     * Settings > API > Webhooks > Security Token.
     *
     * Shiprocket sends this as request header:
     * x-api-key: your-secret
     *
     * Keep blank only for local testing.
     */
    private String webhookSecret;

    private TrackingRefresh trackingRefresh =
            new TrackingRefresh();

    @Getter
    @Setter
    public static class TrackingRefresh {

        /*
         * Keep true in production.
         * This is backup sync in case webhook is delayed/missed.
         */
        private boolean enabled = true;

        /*
         * 30 minutes.
         */
        private long fixedDelayMs = 1800000;

        /*
         * 2 minutes after app startup.
         */
        private long initialDelayMs = 120000;

        /*
         * How many open AWBs to refresh in one scheduler run.
         */
        private int batchSize = 25;
    }
}