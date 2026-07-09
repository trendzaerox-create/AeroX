package com.mydev.ecommerce.order.scheduler;

import com.mydev.ecommerce.email.dto.ReviewRequestEmailPayload;
import com.mydev.ecommerce.email.service.ProductReviewRequestEmailService;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.order.model.OrderItem;
import com.mydev.ecommerce.order.model.OrderReviewEmailJob;
import com.mydev.ecommerce.order.model.ReviewEmailStatus;
import com.mydev.ecommerce.order.repository.OrderReviewEmailJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewEmailScheduler {

    private final OrderReviewEmailJobRepository
            orderReviewEmailJobRepository;

    private final ProductReviewRequestEmailService
            productReviewRequestEmailService;

    @Value("${app.review-email.batch-size:20}")
    private int batchSize;

    @Value("${app.review-email.max-attempts:5}")
    private int maxAttempts;

    @Scheduled(
            fixedDelayString = "${app.review-email.scheduler-fixed-delay-ms:900000}",
            initialDelayString = "${app.review-email.initial-delay-ms:60000}"
    )
    @Transactional
    public void sendDueReviewEmails() {
        List<OrderReviewEmailJob> dueJobs =
                orderReviewEmailJobRepository
                        .findDueJobs(
                                ReviewEmailStatus.PENDING,
                                OffsetDateTime.now(),
                                maxAttempts,
                                PageRequest.of(
                                        0,
                                        batchSize
                                )
                        );

        if (dueJobs.isEmpty()) {
            return;
        }

        for (
                OrderReviewEmailJob job
                : dueJobs
        ) {
            sendOneReviewEmail(job);
        }
    }

    private void sendOneReviewEmail(
            OrderReviewEmailJob job
    ) {
        try {
            ReviewRequestEmailPayload payload =
                    buildPayload(
                            job.getOrder()
                    );

            productReviewRequestEmailService
                    .sendReviewRequestEmail(
                            payload
                    );

            job.setStatus(
                    ReviewEmailStatus.SENT
            );

            job.setSentAt(
                    OffsetDateTime.now()
            );

            job.setLastError(null);

            log.info(
                    "Review email sent -> order={}, to={}",
                    payload.getOrderNumber(),
                    payload.getCustomerEmail()
            );

        } catch (Exception exception) {
            int attempts =
                    job.getAttempts() == null
                            ? 0
                            : job.getAttempts();

            attempts++;

            job.setAttempts(attempts);

            job.setLastError(
                    trimError(
                            exception.getMessage()
                    )
            );

            if (attempts >= maxAttempts) {
                job.setStatus(
                        ReviewEmailStatus.FAILED
                );
            }

            log.error(
                    "Review email failed -> job={}, order={}, attempts={}, reason={}",
                    job.getId(),
                    job.getOrder() != null
                            ? job.getOrder().getOrderNumber()
                            : null,
                    attempts,
                    exception.getMessage(),
                    exception
            );
        }
    }

    private ReviewRequestEmailPayload buildPayload(
            Order order
    ) {
        List<ReviewRequestEmailPayload
                .ReviewRequestEmailItemPayload> items =
                order.getItems()
                        .stream()
                        .map(this::buildItem)
                        .toList();

        return ReviewRequestEmailPayload
                .builder()
                .orderId(
                        order.getId()
                )
                .orderNumber(
                        order.getOrderNumber()
                )
                .customerName(
                        order.getUser().getName()
                )
                .customerEmail(
                        order.getUser().getEmail()
                )
                .items(items)
                .build();
    }

    private ReviewRequestEmailPayload
            .ReviewRequestEmailItemPayload buildItem(
            OrderItem item
    ) {
        return ReviewRequestEmailPayload
                .ReviewRequestEmailItemPayload
                .builder()
                .productId(
                        item.getProduct() != null
                                ? item.getProduct().getId()
                                : null
                )
                .productTitle(
                        item.getProductTitle()
                )
                .imageUrl(
                        item.getImageUrl()
                )
                .build();
    }

    private String trimError(
            String value
    ) {
        if (value == null) {
            return null;
        }

        return value.length() <= 1000
                ? value
                : value.substring(0, 1000);
    }
}