package com.mydev.ecommerce.order.listener;

import com.mydev.ecommerce.email.service.DeliveredEmailService;
import com.mydev.ecommerce.order.event.OrderDeliveredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderDeliveredEmailListener {

    private final DeliveredEmailService deliveredEmailService;

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleOrderDelivered(
            OrderDeliveredEvent event
    ) {
        try {
            deliveredEmailService
                    .sendDeliveredEmail(
                            event.payload()
                    );

            log.info(
                    "Delivered email sent -> order={}, to={}",
                    event.payload().getOrderNumber(),
                    event.payload().getCustomerEmail()
            );

        } catch (Exception exception) {
            log.error(
                    "Delivered email failed -> order={}, to={}, reason={}",
                    event.payload().getOrderNumber(),
                    event.payload().getCustomerEmail(),
                    exception.getMessage(),
                    exception
            );
        }
    }
}