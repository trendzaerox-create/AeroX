package com.mydev.ecommerce.shipment.scheduler;

import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import com.mydev.ecommerce.shipment.service.ShiprocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        prefix = "app.shiprocket.tracking-refresh",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class ShiprocketTrackingScheduler {

    private final ShiprocketService shiprocketService;

    private final ShiprocketProperties properties;

    @Scheduled(
            fixedDelayString = "${app.shiprocket.tracking-refresh.fixed-delay-ms:1800000}",
            initialDelayString = "${app.shiprocket.tracking-refresh.initial-delay-ms:120000}"
    )
    public void refreshOpenTracking() {
        if (!properties.isEnabled()) {
            return;
        }

        try {
            int refreshed =
                    shiprocketService
                            .refreshOpenShipmentsFromScheduler();

            if (refreshed > 0) {
                log.info(
                        "Shiprocket tracking refresh completed. refreshed={}",
                        refreshed
                );
            }

        } catch (Exception exception) {
            log.error(
                    "Shiprocket scheduled tracking refresh failed",
                    exception
            );
        }
    }
}