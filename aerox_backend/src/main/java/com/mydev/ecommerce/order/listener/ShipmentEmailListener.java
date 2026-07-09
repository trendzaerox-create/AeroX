package com.mydev.ecommerce.order.listener;

import com.mydev.ecommerce.email.service.ShipmentEmailService;
import com.mydev.ecommerce.order.event.ShipmentUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ShipmentEmailListener {

    private final ShipmentEmailService shipmentEmailService;

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleShipmentUpdated(
            ShipmentUpdatedEvent event
    ) {
        try {
            shipmentEmailService
                    .sendShipmentConfirmationEmail(
                            event.payload()
                    );

            log.info(
                    "Shipment email sent -> order={}, to={}",
                    event.payload().getOrderNumber(),
                    event.payload().getCustomerEmail()
            );

        } catch (Exception exception) {
            log.error(
                    "Shipment email failed -> order={}, to={}, reason={}",
                    event.payload().getOrderNumber(),
                    event.payload().getCustomerEmail(),
                    exception.getMessage(),
                    exception
            );
        }
    }
}