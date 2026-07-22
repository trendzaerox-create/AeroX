package com.mydev.ecommerce.shipment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.order.model.OrderItem;
import com.mydev.ecommerce.order.model.OrderStatus;
import com.mydev.ecommerce.order.model.PaymentMethod;
import com.mydev.ecommerce.order.model.PaymentStatus;
import com.mydev.ecommerce.order.repository.OrderRepository;
import com.mydev.ecommerce.order.service.OrderService;
import com.mydev.ecommerce.shipment.client.ShiprocketClient;
import com.mydev.ecommerce.shipment.client.ShiprocketClient.ShiprocketApiException;
import com.mydev.ecommerce.shipment.config.ShiprocketProperties;
import com.mydev.ecommerce.shipment.dto.ShiprocketCreateRequest;
import com.mydev.ecommerce.shipment.dto.ShiprocketOrderResponse;
import com.mydev.ecommerce.shipment.model.ShiprocketOrder;
import com.mydev.ecommerce.shipment.repository.ShiprocketOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiprocketService {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private static final DateTimeFormatter SHIPROCKET_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final List<DateTimeFormatter> DATE_TIME_FORMATTERS =
            List.of(
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"),
                    DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"),
                    DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"),
                    DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"),
                    DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")
            );

    private static final List<DateTimeFormatter> DATE_FORMATTERS =
            List.of(
                    DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                    DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                    DateTimeFormatter.ofPattern("yyyy/MM/dd"),
                    DateTimeFormatter.ofPattern("dd/MM/yyyy")
            );

    private final OrderRepository orderRepository;

    private final ShiprocketOrderRepository shiprocketOrderRepository;

    private final ShiprocketClient shiprocketClient;

    private final ShiprocketProperties properties;

    private final ObjectMapper objectMapper;

    private final OrderService orderService;

    private final TransactionTemplate transactionTemplate;

    /*
     * Shiprocket creation is an external workflow.
     *
     * Do not keep one database transaction open across:
     * create order -> assign AWB -> generate pickup.
     *
     * synchronized is acceptable for your current single backend container.
     * If you later run multiple backend replicas, replace this with a
     * database/distributed lock.
     */
    public synchronized ShiprocketOrderResponse createOrContinue(
        Long orderId,
        ShiprocketCreateRequest request
) {
        if (!properties.isEnabled()) {
            throw new RuntimeException(
                    "Shiprocket is disabled. Set SHIPROCKET_ENABLED=true."
            );
        }

        ShiprocketCreateRequest safeRequest =
                request != null
                        ? request
                        : new ShiprocketCreateRequest(
                        null,
                        null,
                        null,
                        null,
                        null,
                        true,
                        null,
                        false
                );

        Order order =
                orderRepository
                        .findDetailedById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        validateOrderCanBeShipped(order);

        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(orderId)
                        .orElse(null);

        boolean hasNoRealShiprocketOrder =
                shiprocketOrder == null
                        || (
                        shiprocketOrder.getShiprocketOrderId() == null
                                && shiprocketOrder.getShiprocketShipmentId() == null
                                && isBlank(shiprocketOrder.getAwbCode())
                );

        if (hasNoRealShiprocketOrder) {
            shiprocketOrder =
                    createShiprocketOrder(
                            order,
                            safeRequest
                    );
        }

        boolean shouldAssignAwb =
                safeRequest.assignAwb() == null
                        || safeRequest.assignAwb();

        if (
                shouldAssignAwb
                        && isBlank(shiprocketOrder.getAwbCode())
        ) {
            if (shiprocketOrder.getShiprocketShipmentId() == null) {
                shiprocketOrder.setStatus(
                        "CREATED_MISSING_SHIPMENT_ID"
                );

                shiprocketOrderRepository.save(
                        shiprocketOrder
                );

                throw new RuntimeException(
                        "Shiprocket order exists but shipment_id is missing. "
                                + "Cannot assign AWB. Check shiprocket_orders.response_json."
                );
            }

            shiprocketOrder =
                    assignAwb(
                            shiprocketOrder,
                            safeRequest.courierId()
                    );
        }

        boolean shouldGeneratePickup =
                safeRequest.generatePickup() != null
                        && safeRequest.generatePickup();

        if (shouldGeneratePickup) {
            generatePickup(
                    shiprocketOrder
            );
        }

        ShiprocketOrder loaded =
                reloadWithOrder(
                        shiprocketOrder
                );

        return map(
                loaded
        );
    }

    @Transactional(readOnly = true)
    public Optional<ShiprocketOrderResponse> findByOrderId(
            Long orderId
    ) {
        return shiprocketOrderRepository
                .findByOrderIdWithOrder(orderId)
                .map(this::map);
    }

    public Optional<ShiprocketOrderResponse> processTrackingWebhook(
            JsonNode payload,
            String apiKey
    ) {
        validateWebhookSecret(apiKey);

        if (payload == null || payload.isNull()) {
            log.warn("Shiprocket webhook payload is empty");
            return Optional.empty();
        }

        validateProviderPayloadSize(payload, "tracking webhook");

        Optional<ShiprocketOrder> optionalShiprocketOrder =
                findMatchingShiprocketOrder(payload);

        if (optionalShiprocketOrder.isEmpty()) {
            log.warn("No matching Shiprocket order found for tracking webhook");
            return Optional.empty();
        }

        ShiprocketOrder saved =
                applyTrackingPayloadInTransaction(
                        optionalShiprocketOrder.get().getId(),
                        payload,
                        "trackingWebhook"
                );

        return Optional.of(map(saved));
    }

    public ShiprocketOrderResponse refreshTrackingByOrderId(
            Long orderId
    ) {
        if (!properties.isEnabled()) {
            throw new IllegalStateException(
                    "Shiprocket is disabled. Set SHIPROCKET_ENABLED=true."
            );
        }

        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Shiprocket order not found for order id: " + orderId
                                )
                        );

        return map(
                refreshTrackingEntity(
                        shiprocketOrder,
                        "adminSingleRefresh"
                )
        );
    }

    public int refreshOpenShipmentsFromAdmin() {
        if (!properties.isEnabled()) {
            return 0;
        }

        return refreshOpenShipments("adminBulkRefresh");
    }

    public int refreshOpenShipmentsFromScheduler() {
        if (!properties.isEnabled()) {
            return 0;
        }

        return refreshOpenShipments("schedulerRefresh");
    }

    private int refreshOpenShipments(
            String source
    ) {
        int batchSize =
                properties.getTrackingRefresh() != null
                        ? properties.getTrackingRefresh().getBatchSize()
                        : 25;

        batchSize = Math.max(1, Math.min(50, batchSize));

        List<ShiprocketOrder> candidates =
                shiprocketOrderRepository
                        .findOpenOrdersForTracking(
                                PageRequest.of(0, batchSize)
                        );

        int updated = 0;
        int failed = 0;

        for (ShiprocketOrder shiprocketOrder : candidates) {
            try {
                refreshTrackingEntity(
                        shiprocketOrder,
                        source
                );
                updated++;

            } catch (Exception exception) {
                failed++;

                log.warn(
                        "Shiprocket tracking refresh failed. source={}, shiprocketOrderLocalId={}, awb={}, reason={}",
                        source,
                        shiprocketOrder.getId(),
                        shiprocketOrder.getAwbCode(),
                        exception.getMessage()
                );
            }
        }

        log.info(
                "Shiprocket tracking refresh completed. source={}, checked={}, updated={}, failed={}",
                source,
                candidates.size(),
                updated,
                failed
        );

        return updated;
    }

    private ShiprocketOrder refreshTrackingEntity(
            ShiprocketOrder shiprocketOrder,
            String responseKey
    ) {
        ShiprocketOrder loaded = reloadWithOrder(shiprocketOrder);

        try {
            JsonNode response = fetchTrackingFromShiprocket(loaded);
            validateProviderPayloadSize(response, "tracking response");

            return applyTrackingPayloadInTransaction(
                    loaded.getId(),
                    response,
                    responseKey
            );

        } catch (ShiprocketApiException exception) {
            if (isCancelledAwbResponse(exception)) {
                return markAwbCancelledInTransaction(loaded.getId());
            }

            throw exception;
        }
    }

    private ShiprocketOrder applyTrackingPayloadInTransaction(
            Long shiprocketOrderId,
            JsonNode payload,
            String responseKey
    ) {
        OptimisticLockingFailureException lastConflict = null;

        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                ShiprocketOrder result =
                        transactionTemplate.execute(status -> {
                            ShiprocketOrder current =
                                    shiprocketOrderRepository
                                            .findByIdWithOrder(shiprocketOrderId)
                                            .orElseThrow(() ->
                                                    new RuntimeException(
                                                            "Shiprocket order no longer exists: "
                                                                    + shiprocketOrderId
                                                    )
                                            );

                            return applyTrackingPayload(
                                    current,
                                    payload,
                                    responseKey
                            );
                        });

                if (result == null) {
                    throw new IllegalStateException(
                            "Shiprocket tracking update returned no result"
                    );
                }

                return result;

            } catch (OptimisticLockingFailureException exception) {
                lastConflict = exception;

                if (attempt == 1) {
                    log.info(
                            "Retrying concurrent Shiprocket tracking update. shiprocketOrderLocalId={}",
                            shiprocketOrderId
                    );
                }
            }
        }

        if (lastConflict != null) {
            throw lastConflict;
        }

        throw new IllegalStateException(
                "Could not save Shiprocket tracking update"
        );
    }

    private ShiprocketOrder markAwbCancelledInTransaction(
            Long shiprocketOrderId
    ) {
        ShiprocketOrder saved =
                transactionTemplate.execute(status -> {
                    ShiprocketOrder current =
                            shiprocketOrderRepository
                                    .findByIdWithOrder(shiprocketOrderId)
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Shiprocket order no longer exists: "
                                                            + shiprocketOrderId
                                            )
                                    );

                    current.setStatus("AWB_CANCELLED");
                    current.setLatestActivity("AWB cancelled");
                    current.setLastTrackedAt(OffsetDateTime.now());

                    return shiprocketOrderRepository.save(current);
                });

        if (saved == null) {
            throw new IllegalStateException(
                    "Could not save cancelled Shiprocket AWB state"
            );
        }

        log.info(
                "Stopped Shiprocket polling for cancelled AWB. shiprocketOrderLocalId={}, awb={}",
                saved.getId(),
                saved.getAwbCode()
        );

        return saved;
    }

    private boolean isCancelledAwbResponse(
            ShiprocketApiException exception
    ) {
        if (
                exception == null
                        || isBlank(
                        exception.getResponseBody()
                )
        ) {
            return false;
        }

        String body =
                exception
                        .getResponseBody()
                        .toLowerCase(
                                Locale.ROOT
                        );

        return body.contains(
                "awb has been cancelled"
        )
                || body.contains(
                "awb is cancelled"
        )
                || body.contains(
                "awb cancelled"
        );
    }

    private JsonNode fetchTrackingFromShiprocket(
            ShiprocketOrder shiprocketOrder
    ) {
        String awbCode =
                shiprocketOrder.getAwbCode();

        if (isBlank(awbCode)) {
            throw new RuntimeException(
                    "AWB code is missing. Cannot refresh Shiprocket tracking."
            );
        }

        return shiprocketClient
                .trackByAwb(
                        awbCode
                );
    }

    private ShiprocketOrder applyTrackingPayload(
            ShiprocketOrder shiprocketOrder,
            JsonNode payload,
            String responseKey
    ) {
        String status =
                safeStatus(
                        extractTrackingStatus(
                                payload
                        ),
                        "TRACKING_UPDATED"
                );

        String normalizedStatus =
                normalizeStatus(
                        status
                );

        OffsetDateTime eventTime =
                firstNonNull(
                        findDateAny(
                                payload,
                                "scan_date",
                                "event_time",
                                "tracking_time",
                                "tracking_date",
                                "current_timestamp",
                                "timestamp",
                                "updated_at",
                                "created_at",
                                "date"
                        ),
                        OffsetDateTime.now()
                );

        /*
         * Ignore delayed events that are older than the latest tracking event.
         * Nothing is changed before this check, so a stale managed entity cannot
         * accidentally flush partial changes.
         */
        if (
                shiprocketOrder.getLastTrackedAt() != null
                        && eventTime.isBefore(
                        shiprocketOrder.getLastTrackedAt()
                )
        ) {
            log.info(
                    "Ignoring stale Shiprocket tracking event. "
                            + "shiprocketOrderLocalId={}, incomingTime={}, storedTime={}",
                    shiprocketOrder.getId(),
                    eventTime,
                    shiprocketOrder.getLastTrackedAt()
            );

            return shiprocketOrder;
        }

        /*
         * Ignore an exact duplicate event.
         */
        if (
                shiprocketOrder.getLastTrackedAt() != null
                        && eventTime.isEqual(
                        shiprocketOrder.getLastTrackedAt()
                )
                        && normalizedStatus.equals(
                        normalizeStatus(
                                shiprocketOrder.getStatus()
                        )
                )
        ) {
            return shiprocketOrder;
        }

        /*
         * A delivered shipment is terminal for the customer-facing flow.
         * Never downgrade it because an older or malformed event arrived.
         */
        if (
                shiprocketOrder.getDeliveredAt() != null
                        && !isDeliveredStatus(
                        normalizedStatus
                )
        ) {
            log.info(
                    "Ignoring Shiprocket status regression after delivery. "
                            + "shiprocketOrderLocalId={}, incomingStatus={}",
                    shiprocketOrder.getId(),
                    status
            );

            return shiprocketOrder;
        }

        String awbCode =
                firstNonBlank(
                        findTextAny(
                                payload,
                                "awb_code",
                                "awb",
                                "awbCode"
                        ),
                        shiprocketOrder.getAwbCode()
                );

        if (!isBlank(awbCode)) {
            shiprocketOrder.setAwbCode(
                    awbCode
            );

            shiprocketOrder.setTrackingUrl(
                    firstNonBlank(
                            findTextAny(
                                    payload,
                                    "tracking_url",
                                    "track_url",
                                    "trackingUrl"
                            ),
                            shiprocketOrder.getTrackingUrl(),
                            buildTrackingUrl(awbCode)
                    )
            );
        }

        shiprocketOrder.setCourierName(
                firstNonBlank(
                        findTextAny(
                                payload,
                                "courier_name",
                                "courier_company_name",
                                "courier"
                        ),
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                firstNonBlank(
                        findTextAny(
                                payload,
                                "courier_company_id",
                                "courier_id"
                        ),
                        shiprocketOrder.getCourierCompanyId()
                )
        );

        OffsetDateTime expectedDeliveryAt =
                findDateAny(
                        payload,
                        "edd",
                        "etd",
                        "expected_delivery",
                        "expected_delivery_date",
                        "promised_delivery_date"
                );

        shiprocketOrder.setStatus(
                status
        );

        shiprocketOrder.setStatusCode(
                firstNonBlank(
                        extractTrackingStatusCode(
                                payload
                        ),
                        shiprocketOrder.getStatusCode()
                )
        );

        shiprocketOrder.setLatestActivity(
                firstNonBlank(
                        extractTrackingActivity(
                                payload
                        ),
                        shiprocketOrder.getLatestActivity(),
                        status
                )
        );

        shiprocketOrder.setLatestLocation(
                firstNonBlank(
                        extractTrackingLocation(
                                payload
                        ),
                        shiprocketOrder.getLatestLocation()
                )
        );

        shiprocketOrder.setLastTrackedAt(
                eventTime
        );

        if (expectedDeliveryAt != null) {
            shiprocketOrder.setExpectedDeliveryAt(
                    expectedDeliveryAt
            );
        }

        if (
                (
                        isPickedUpOrShippedStatus(
                                normalizedStatus
                        )
                                || isOutForDeliveryStatus(
                                normalizedStatus
                        )
                )
                        && shiprocketOrder.getPickedUpAt() == null
        ) {
            shiprocketOrder.setPickedUpAt(
                    eventTime
            );
        }

        if (isDeliveredStatus(normalizedStatus)) {
            if (shiprocketOrder.getPickedUpAt() == null) {
                shiprocketOrder.setPickedUpAt(
                        eventTime
                );
            }

            shiprocketOrder.setDeliveredAt(
                    eventTime
            );
        }

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        responseKey,
                        payload
                )
        );

        if (
                responseKey != null
                        && responseKey
                        .toLowerCase(
                                Locale.ROOT
                        )
                        .contains("webhook")
        ) {
            shiprocketOrder.setWebhookJson(
                    mergeResponseJson(
                            shiprocketOrder.getWebhookJson(),
                            responseKey,
                            payload
                    )
            );

        } else {
            shiprocketOrder.setTrackingJson(
                    mergeResponseJson(
                            shiprocketOrder.getTrackingJson(),
                            responseKey,
                            payload
                    )
            );
        }

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(
                                shiprocketOrder
                        );

        saved =
                reloadWithOrder(
                        saved
                );

        /*
         * AWB assignment alone does not mean that the parcel was shipped.
         * Create/update the customer shipment only after pickup, in-transit,
         * out-for-delivery or delivered tracking is received.
         */
        boolean customerShipmentStarted =
                isPickedUpOrShippedStatus(
                        normalizedStatus
                )
                        || isOutForDeliveryStatus(
                        normalizedStatus
                )
                        || isDeliveredStatus(
                        normalizedStatus
                );

        if (
                customerShipmentStarted
                        && !isBlank(
                        saved.getAwbCode()
                )
        ) {
            updateCustomerShipment(
                    saved
            );
        }

        updateOrderStatusFromTracking(
                saved,
                payload
        );

        return saved;
    }

    private void updateOrderStatusFromTracking(
            ShiprocketOrder shiprocketOrder,
            JsonNode payload
    ) {
        if (
                shiprocketOrder == null
                        || shiprocketOrder.getOrder() == null
        ) {
            return;
        }

        String trackingStatus =
                firstNonBlank(
                        extractTrackingStatus(
                                payload
                        ),
                        shiprocketOrder.getStatus()
                );

        if (isBlank(trackingStatus)) {
            return;
        }

        String normalized =
                normalizeStatus(
                        trackingStatus
                );

        String targetStatusName = null;

        if (isDeliveredStatus(normalized)) {
            targetStatusName = "DELIVERED";

        } else if (isOutForDeliveryStatus(normalized)) {
            targetStatusName = "OUT_FOR_DELIVERY";

        } else if (isPickedUpOrShippedStatus(normalized)) {
            targetStatusName = "SHIPPED";
        }

        /*
         * Never map an AWB cancellation, pickup cancellation, courier
         * cancellation or RTO status to the customer's order cancellation.
         * Customer/admin cancellation must remain a separate workflow.
         */
        if (isBlank(targetStatusName)) {
            return;
        }

        try {
            Order order =
                    shiprocketOrder.getOrder();

            String currentStatusName =
                    order.getStatus() != null
                            ? order.getStatus().name()
                            : "";

            /*
             * Never downgrade terminal customer order states.
             */
            if (
                    "DELIVERED".equals(
                            currentStatusName
                    )
                            || "CANCELLED".equals(
                            currentStatusName
                    )
            ) {
                return;
            }

            /*
             * Do not move OUT_FOR_DELIVERY backwards to SHIPPED.
             */
            if (
                    "OUT_FOR_DELIVERY".equals(
                            currentStatusName
                    )
                            && "SHIPPED".equals(
                            targetStatusName
                    )
            ) {
                return;
            }

            OrderStatus targetStatus =
                    OrderStatus.valueOf(
                            targetStatusName
                    );

            if (order.getStatus() == targetStatus) {
                return;
            }

            orderService.updateStatusFromSystem(
                    order.getId(),
                    targetStatus
            );

            log.info(
                    "Order status updated from Shiprocket tracking. orderId={}, status={}",
                    order.getId(),
                    targetStatus
            );

        } catch (IllegalArgumentException exception) {
            log.warn(
                    "OrderStatus enum does not contain {}. "
                            + "Skipping automatic status update.",
                    targetStatusName
            );

        } catch (Exception exception) {
            /*
             * Do not acknowledge the webhook when the ecommerce order update
             * failed. The transaction can roll back and Shiprocket can retry.
             */
            throw new RuntimeException(
                    "Could not update ecommerce order status from Shiprocket. "
                            + "shiprocketOrderLocalId="
                            + shiprocketOrder.getId(),
                    exception
            );
        }
    }

    private Optional<ShiprocketOrder> findMatchingShiprocketOrder(
            JsonNode payload
    ) {
        String awbCode =
                findTextAny(
                        payload,
                        "awb_code",
                        "awb",
                        "awbCode"
                );

        if (!isBlank(awbCode)) {
            Optional<ShiprocketOrder> byAwb =
                    shiprocketOrderRepository
                            .findByAwbCodeWithOrder(
                                    awbCode
                            );

            if (byAwb.isPresent()) {
                return byAwb;
            }
        }

        Long shipmentId =
                findLongAny(
                        payload,
                        "shipment_id",
                        "shipmentId",
                        "shiprocket_shipment_id"
                );

        if (shipmentId != null) {
            Optional<ShiprocketOrder> byShipmentId =
                    shiprocketOrderRepository
                            .findByShiprocketShipmentIdWithOrder(
                                    shipmentId
                            );

            if (byShipmentId.isPresent()) {
                return byShipmentId;
            }
        }

        Long shiprocketOrderId =
                findLongAny(
                        payload,
                        "shiprocket_order_id",
                        "order_id"
                );

        if (shiprocketOrderId != null) {
            Optional<ShiprocketOrder> byShiprocketOrderId =
                    shiprocketOrderRepository
                            .findByShiprocketOrderIdWithOrder(
                                    shiprocketOrderId
                            );

            if (byShiprocketOrderId.isPresent()) {
                return byShiprocketOrderId;
            }
        }

        String orderNumber =
                findTextAny(
                        payload,
                        "channel_order_id",
                        "order_number",
                        "order_no",
                        "ecommerce_order_number"
                );

        if (!isBlank(orderNumber)) {
            return shiprocketOrderRepository
                    .findByEcommerceOrderNumberWithOrder(
                            orderNumber
                    );
        }

        return Optional.empty();
    }

    private ShiprocketOrder createShiprocketOrder(
            Order order,
            ShiprocketCreateRequest request
    ) {
        Map<String, Object> payload =
                buildCreateOrderPayload(
                        order,
                        request
                );

        JsonNode response =
                shiprocketClient
                        .createOrder(
                                payload
                        );

        validateProviderPayloadSize(response, "create-order response");

        Long createdShiprocketOrderId =
                extractShiprocketOrderId(
                        response
                );

        Long createdShipmentId =
                extractShipmentId(
                        response
                );

        String createdAwbCode =
                findTextAny(
                        response,
                        "awb_code",
                        "awb"
                );

        if (
                createdShiprocketOrderId == null
                        && createdShipmentId == null
                        && isBlank(createdAwbCode)
        ) {
            throw new RuntimeException(
                    "Shiprocket did not return an order or shipment identifier"
            );
        }

        ShiprocketOrder shiprocketOrder =
                shiprocketOrderRepository
                        .findByOrderIdWithOrder(
                                order.getId()
                        )
                        .orElseGet(
                                ShiprocketOrder::new
                        );

        shiprocketOrder.setOrder(
                order
        );

        shiprocketOrder.setShiprocketOrderId(
                createdShiprocketOrderId
        );

        shiprocketOrder.setShiprocketShipmentId(
                createdShipmentId
        );

        shiprocketOrder.setAwbCode(
                createdAwbCode
        );

        shiprocketOrder.setCourierName(
                findTextAny(
                        response,
                        "courier_name",
                        "courier_company_name"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                findTextAny(
                        response,
                        "courier_company_id"
                )
        );

        shiprocketOrder.setTrackingUrl(
                firstNonBlank(
                        findTextAny(
                                response,
                                "tracking_url",
                                "track_url"
                        ),
                        !isBlank(createdAwbCode)
                                ? buildTrackingUrl(createdAwbCode)
                                : null
                )
        );

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(
                                        response,
                                        "status"
                                ),
                                findDirectText(
                                        response,
                                        "message"
                                )
                        ),
                        "CREATED"
                )
        );

        shiprocketOrder.setRequestJson(
                toJson(
                        payload
                )
        );

        shiprocketOrder.setResponseJson(
                toJson(
                        response
                )
        );

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(
                                shiprocketOrder
                        );

        saved =
                reloadWithOrder(
                        saved
                );
        return saved;
    }

    private ShiprocketOrder assignAwb(
            ShiprocketOrder shiprocketOrder,
            Integer courierId
    ) {
        if (shiprocketOrder.getShiprocketShipmentId() == null) {
            throw new RuntimeException(
                    "Shiprocket shipment id is missing. Cannot assign AWB."
            );
        }

        JsonNode response =
                shiprocketClient
                        .assignAwb(
                                shiprocketOrder.getShiprocketShipmentId(),
                                courierId
                        );

        validateProviderPayloadSize(response, "assign-AWB response");

        String awbCode =
                firstNonBlank(
                        findTextAny(
                                response,
                                "awb_code",
                                "awb"
                        ),
                        shiprocketOrder.getAwbCode()
                );

        if (isBlank(awbCode)) {
            throw new RuntimeException(
                    "Shiprocket did not return an AWB code"
            );
        }

        shiprocketOrder.setAwbCode(
                awbCode
        );

        shiprocketOrder.setCourierName(
                firstNonBlank(
                        findTextAny(
                                response,
                                "courier_name",
                                "courier_company_name"
                        ),
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                )
        );

        shiprocketOrder.setCourierCompanyId(
                firstNonBlank(
                        findTextAny(
                                response,
                                "courier_company_id"
                        ),
                        shiprocketOrder.getCourierCompanyId()
                )
        );

        shiprocketOrder.setTrackingUrl(
                firstNonBlank(
                        findTextAny(
                                response,
                                "tracking_url",
                                "track_url"
                        ),
                        buildTrackingUrl(awbCode)
                )
        );

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(
                                        response,
                                        "status"
                                ),
                                findDirectText(
                                        response,
                                        "message"
                                )
                        ),
                        "AWB_ASSIGNED"
                )
        );

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        "assignAwb",
                        response
                )
        );

        ShiprocketOrder saved =
                shiprocketOrderRepository
                        .save(
                                shiprocketOrder
                        );

        saved =
                reloadWithOrder(
                        saved
                );
        return saved;
    }

    private void generatePickup(
            ShiprocketOrder shiprocketOrder
    ) {
        if (shiprocketOrder.getShiprocketShipmentId() == null) {
            throw new RuntimeException(
                    "Shiprocket shipment id is missing. Cannot generate pickup."
            );
        }

        if (shiprocketOrder.getPickupGeneratedAt() != null) {
            log.info(
                    "Shiprocket pickup already generated. shiprocketOrderLocalId={}, shipmentId={}",
                    shiprocketOrder.getId(),
                    shiprocketOrder.getShiprocketShipmentId()
            );
            return;
        }

        JsonNode response =
                shiprocketClient
                        .generatePickup(
                                shiprocketOrder.getShiprocketShipmentId()
                        );

        validateProviderPayloadSize(response, "pickup response");

        if (!isPickupGenerated(response)) {
            throw new RuntimeException(
                    "Shiprocket did not confirm pickup generation"
            );
        }

        shiprocketOrder.setStatus(
                safeStatus(
                        firstNonBlank(
                                findDirectText(response, "status"),
                                findDirectText(response, "message")
                        ),
                        "PICKUP_GENERATED"
                )
        );

        shiprocketOrder.setPickupGeneratedAt(OffsetDateTime.now());

        shiprocketOrder.setResponseJson(
                mergeResponseJson(
                        shiprocketOrder.getResponseJson(),
                        "generatePickup",
                        response
                )
        );

        shiprocketOrderRepository.save(shiprocketOrder);
    }

    private boolean isPickupGenerated(
            JsonNode response
    ) {
        Long pickupStatus =
                findLongAny(
                        response,
                        "pickup_status",
                        "pickup_generated"
                );

        if (pickupStatus != null) {
            return pickupStatus == 1L;
        }

        String message =
                findTextAny(
                        response,
                        "data",
                        "message"
                );

        String normalized =
                message != null
                        ? message.toLowerCase(Locale.ROOT)
                        : "";

        return (
                normalized.contains("pickup")
                        && (
                        normalized.contains("generated")
                                || normalized.contains("confirmed")
                )
        )
                && !normalized.contains("failed")
                && !normalized.contains("error");
    }

    private void updateCustomerShipment(
            ShiprocketOrder shiprocketOrder
    ) {
        String awbCode =
                shiprocketOrder.getAwbCode();

        if (isBlank(awbCode)) {
            return;
        }

        String courierName =
                firstNonBlank(
                        shiprocketOrder.getCourierName(),
                        "Shiprocket"
                );

        courierName =
                trimMax(
                        courierName,
                        100
                );

        String trackingUrl =
                firstNonBlank(
                        shiprocketOrder.getTrackingUrl(),
                        buildTrackingUrl(
                                awbCode
                        )
                );

        Order order =
                shiprocketOrder.getOrder();

        if (order == null || order.getId() == null) {
            throw new RuntimeException(
                    "Order is missing for Shiprocket shipment update"
            );
        }

        orderService.adminUpdateShipment(
                order.getId(),
                new UpdateShipmentRequest(
                        courierName,
                        awbCode,
                        trackingUrl
                )
        );
    }

    private ShiprocketOrder reloadWithOrder(
            ShiprocketOrder shiprocketOrder
    ) {
        if (
                shiprocketOrder == null
                        || shiprocketOrder.getId() == null
        ) {
            return shiprocketOrder;
        }

        return shiprocketOrderRepository
                .findByIdWithOrder(
                        shiprocketOrder.getId()
                )
                .orElse(
                        shiprocketOrder
                );
    }

    private void validateOrderCanBeShipped(
            Order order
    ) {
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order cannot be sent to Shiprocket"
            );
        }

        if (
                order.getItems() == null
                        || order.getItems().isEmpty()
        ) {
            throw new RuntimeException(
                    "Order has no items"
            );
        }

        if (
                order.getPaymentMethod() == PaymentMethod.ONLINE
                        && order.getPaymentStatus() != PaymentStatus.PAID
        ) {
            throw new RuntimeException(
                    "Online order is not paid yet. Create Shiprocket shipment only after payment is PAID."
            );
        }
    }

    private void validateWebhookSecret(
            String apiKey
    ) {
        String expectedSecret = properties.getWebhookSecret();

        if (isBlank(expectedSecret)) {
            if (properties.isEnabled()) {
                throw new InvalidWebhookSecretException(
                        "SHIPROCKET_WEBHOOK_SECRET is required when Shiprocket is enabled"
                );
            }

            log.warn(
                    "SHIPROCKET_WEBHOOK_SECRET is blank. Webhook validation was skipped because Shiprocket is disabled."
            );
            return;
        }

        if (isBlank(apiKey)) {
            throw new InvalidWebhookSecretException(
                    "Invalid Shiprocket webhook secret"
            );
        }

        byte[] expected =
                expectedSecret
                        .trim()
                        .getBytes(StandardCharsets.UTF_8);

        byte[] actual =
                apiKey
                        .trim()
                        .getBytes(StandardCharsets.UTF_8);

        if (!MessageDigest.isEqual(expected, actual)) {
            throw new InvalidWebhookSecretException(
                    "Invalid Shiprocket webhook secret"
            );
        }
    }

    private Map<String, Object> buildCreateOrderPayload(
            Order order,
            ShiprocketCreateRequest request
    ) {
        if (order.getUser() == null) {
            throw new RuntimeException(
                    "Order customer is missing"
            );
        }

        Map<String, Object> payload = new LinkedHashMap<>();

        String[] customerName =
                splitCustomerName(
                        required(
                                order.getAddressFullName(),
                                "Customer name"
                        )
                );

        payload.put(
                "order_id",
                safeOrderReference(order)
        );

        payload.put(
                "order_date",
                order.getCreatedAt()
                        .atZoneSameInstant(INDIA_ZONE)
                        .format(SHIPROCKET_DATE_FORMAT)
        );

        payload.put(
                "pickup_location",
                resolvePickupLocation(request)
        );

        payload.put(
                "billing_customer_name",
                trimMax(customerName[0], 50)
        );

        payload.put(
                "billing_last_name",
                trimMax(customerName[1], 50)
        );

        payload.put(
                "billing_address",
                trimMax(
                        required(
                                order.getAddressLine1(),
                                "Address line 1"
                        ),
                        80
                )
        );

        payload.put(
                "billing_address_2",
                order.getAddressLine2() == null
                        ? ""
                        : trimMax(order.getAddressLine2(), 80)
        );

        payload.put(
                "billing_city",
                trimMax(
                        required(
                                order.getAddressCity(),
                                "City"
                        ),
                        30
                )
        );

        payload.put(
                "billing_pincode",
                normalizeIndianPincode(
                        required(
                                order.getAddressPincode(),
                                "Pincode"
                        )
                )
        );

        payload.put(
                "billing_state",
                trimMax(
                        required(
                                order.getAddressState(),
                                "State"
                        ),
                        50
                )
        );

        payload.put(
                "billing_country",
                trimMax(
                        firstNonBlank(
                                order.getAddressCountry(),
                                "India"
                        ),
                        50
                )
        );

        payload.put(
                "billing_email",
                trimMax(
                        required(
                                order.getUser().getEmail(),
                                "Customer email"
                        ),
                        100
                )
        );

        payload.put(
                "billing_phone",
                normalizeIndianPhone(
                        required(
                                order.getAddressPhone(),
                                "Phone"
                        )
                )
        );

        payload.put("shipping_is_billing", true);
        payload.put("order_items", buildOrderItems(order));

        payload.put(
                "payment_method",
                order.getPaymentMethod() == PaymentMethod.COD
                        ? "COD"
                        : "Prepaid"
        );

        payload.put(
                "shipping_charges",
                money(order.getShippingAmount())
        );

        payload.put("giftwrap_charges", BigDecimal.ZERO);
        payload.put("transaction_charges", BigDecimal.ZERO);

        payload.put(
                "total_discount",
                money(order.getDiscountAmount())
        );

        /*
         * Shiprocket expects sub_total after discount and before the separately
         * supplied shipping_charges. Using order.totalAmount here would count
         * shipping twice when shipping is non-zero.
         */
        payload.put(
                "sub_total",
                money(calculateShiprocketSubTotal(order))
        );

        payload.put(
                "length",
                packageValue(
                        request.lengthCm(),
                        properties.getDefaultLengthCm(),
                        "length",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "breadth",
                packageValue(
                        request.breadthCm(),
                        properties.getDefaultBreadthCm(),
                        "breadth",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "height",
                packageValue(
                        request.heightCm(),
                        properties.getDefaultHeightCm(),
                        "height",
                        new BigDecimal("0.50")
                )
        );

        payload.put(
                "weight",
                packageValue(
                        request.weightKg(),
                        properties.getDefaultWeightKg(),
                        "weight",
                        new BigDecimal("0.01")
                )
        );

        return payload;
    }

    private String[] splitCustomerName(
            String fullName
    ) {
        String normalized =
                fullName
                        .trim()
                        .replaceAll("\\s+", " ");

        int separator = normalized.indexOf(' ');

        if (separator < 0) {
            return new String[]{normalized, ""};
        }

        return new String[]{
                normalized.substring(0, separator),
                normalized.substring(separator + 1)
        };
    }

    private BigDecimal calculateShiprocketSubTotal(
            Order order
    ) {
        BigDecimal subtotal =
                order.getSubtotalAmount() != null
                        ? order.getSubtotalAmount()
                        : BigDecimal.ZERO;

        BigDecimal discount =
                order.getDiscountAmount() != null
                        ? order.getDiscountAmount()
                        : BigDecimal.ZERO;

        BigDecimal result = subtotal.subtract(discount);

        if (result.signum() < 0) {
            throw new RuntimeException(
                    "Order discount cannot exceed order subtotal"
            );
        }

        return result;
    }

    private String resolvePickupLocation(
            ShiprocketCreateRequest request
    ) {
        String pickupLocation =
                firstNonBlank(
                        request.pickupLocation(),
                        properties.getPickupLocation()
                );

        if (isBlank(pickupLocation)) {
            throw new RuntimeException(
                    "Shiprocket pickup location is required. Set SHIPROCKET_PICKUP_LOCATION exactly as configured in Shiprocket dashboard."
            );
        }

        return pickupLocation.trim();
    }

    private List<Map<String, Object>> buildOrderItems(
            Order order
    ) {
        return order
                .getItems()
                .stream()
                .map(
                        this::buildOrderItem
                )
                .toList();
    }

    private Map<String, Object> buildOrderItem(
            OrderItem item
    ) {
        if (item == null) {
            throw new RuntimeException(
                    "Order item is missing"
            );
        }

        if (item.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Order item quantity must be greater than zero"
            );
        }

        if (
                item.getUnitPrice() == null
                        || item.getUnitPrice().signum() < 0
        ) {
            throw new RuntimeException(
                    "Order item price is invalid"
            );
        }

        Map<String, Object> payload = new LinkedHashMap<>();

        payload.put(
                "name",
                trimMax(
                        required(
                                item.getProductTitle(),
                                "Product title"
                        ),
                        200
                )
        );

        payload.put(
                "sku",
                item.getProduct() != null
                        && item.getProduct().getId() != null
                        ? "PROD-" + item.getProduct().getId()
                        : "ITEM-" + item.getId()
        );

        payload.put("units", item.getQuantity());
        payload.put("selling_price", money(item.getUnitPrice()));

        return payload;
    }

    private ShiprocketOrderResponse map(
            ShiprocketOrder shiprocketOrder
    ) {
        Order order =
                shiprocketOrder.getOrder();

        Long orderId =
                order != null
                        ? order.getId()
                        : null;

        String orderNumber =
                order != null
                        ? order.getOrderNumber()
                        : null;

        return new ShiprocketOrderResponse(
                shiprocketOrder.getId(),
                orderId,
                orderNumber,
                shiprocketOrder.getShiprocketOrderId(),
                shiprocketOrder.getShiprocketShipmentId(),
                shiprocketOrder.getAwbCode(),
                shiprocketOrder.getCourierName(),
                shiprocketOrder.getCourierCompanyId(),
                shiprocketOrder.getTrackingUrl(),
                shiprocketOrder.getStatus(),
                shiprocketOrder.getStatusCode(),
                shiprocketOrder.getLatestActivity(),
                shiprocketOrder.getLatestLocation(),
                shiprocketOrder.getLastTrackedAt(),
                shiprocketOrder.getPickedUpAt(),
                shiprocketOrder.getDeliveredAt(),
                shiprocketOrder.getExpectedDeliveryAt(),
                shiprocketOrder.getCreatedAt(),
                shiprocketOrder.getUpdatedAt()
        );
    }

    private String safeOrderReference(
            Order order
    ) {
        String value =
                firstNonBlank(
                        order.getOrderNumber(),
                        "ORDER-" + order.getId()
                );

        return trimMax(
                value,
                50
        );
    }

    private String buildTrackingUrl(
            String awbCode
    ) {
        String base =
                properties.getTrackingBaseUrl();

        if (isBlank(base)) {
            return null;
        }

        base =
                base.trim();

        if (base.endsWith("/")) {
            return base + awbCode;
        }

        return base + "/" + awbCode;
    }

    private BigDecimal money(
            BigDecimal value
    ) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        if (value.signum() < 0) {
            throw new RuntimeException(
                    "Money value cannot be negative"
            );
        }

        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal packageValue(
            BigDecimal requestValue,
            BigDecimal defaultValue,
            String fieldName,
            BigDecimal minimum
    ) {
        BigDecimal value =
                requestValue != null
                        ? requestValue
                        : defaultValue;

        if (value == null) {
            throw new RuntimeException(
                    "Package " + fieldName + " is missing"
            );
        }

        if (value.compareTo(minimum) < 0) {
            throw new RuntimeException(
                    "Package "
                            + fieldName
                            + " must be at least "
                            + minimum
            );
        }

        if (value.compareTo(new BigDecimal("1000.00")) > 0) {
            throw new RuntimeException(
                    "Package " + fieldName + " is unreasonably large"
            );
        }

        return value.stripTrailingZeros();
    }

    private String normalizeIndianPincode(
            String value
    ) {
        String digits =
                onlyDigits(
                        value
                );

        if (digits.length() != 6) {
            throw new RuntimeException(
                    "Pincode must contain exactly 6 digits"
            );
        }

        return digits;
    }

    private String normalizeIndianPhone(
            String value
    ) {
        String digits =
                onlyDigits(
                        value
                );

        if (digits.length() > 10) {
            digits =
                    digits.substring(
                            digits.length() - 10
                    );
        }

        if (
                digits.length() != 10
                        || !digits.matches(
                        "[6-9][0-9]{9}"
                )
        ) {
            throw new RuntimeException(
                    "Phone number must be a valid 10-digit Indian mobile number"
            );
        }

        return digits;
    }

    private String onlyDigits(
            String value
    ) {
        return value
                .replaceAll(
                        "[^0-9]",
                        ""
                );
    }

    private String required(
            String value,
            String fieldName
    ) {
        if (isBlank(value)) {
            throw new RuntimeException(
                    fieldName + " is required"
            );
        }

        return value.trim();
    }

    private String trimMax(
            String value,
            int max
    ) {
        if (value == null) {
            return null;
        }

        String trimmed =
                value.trim();

        if (trimmed.length() <= max) {
            return trimmed;
        }

        return trimmed.substring(
                0,
                max
        );
    }

    private String firstNonBlank(
            String... values
    ) {
        if (values == null) {
            return null;
        }

        for (String value : values) {
            if (!isBlank(value)) {
                return value.trim();
            }
        }

        return null;
    }

    private OffsetDateTime firstNonNull(
            OffsetDateTime... values
    ) {
        if (values == null) {
            return null;
        }

        for (OffsetDateTime value : values) {
            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private boolean isBlank(
            String value
    ) {
        return value == null
                || value.isBlank();
    }

    private String safeStatus(
            String value,
            String fallback
    ) {
        return trimMax(
                firstNonBlank(
                        value,
                        fallback
                ),
                80
        );
    }

    private String normalizeStatus(
            String value
    ) {
        if (value == null) {
            return "";
        }

        return value
                .toLowerCase(
                        Locale.ROOT
                )
                .replace('_', ' ')
                .replace('-', ' ')
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }

    private boolean isDeliveredStatus(
            String normalizedStatus
    ) {
        return "delivered".equals(
                normalizedStatus
        )
                || "dlvd".equals(
                normalizedStatus
        )
                || normalizedStatus.startsWith(
                "delivered "
        );
    }

    private boolean isPickedUpOrShippedStatus(
            String normalizedStatus
    ) {
        if (
                isCancellationStatus(
                        normalizedStatus
                )
                        || isReturnStatus(
                        normalizedStatus
                )
                        || isDeliveryFailureStatus(
                        normalizedStatus
                )
        ) {
            return false;
        }

        return equalsOrStartsWith(
                normalizedStatus,
                "picked up",
                "pickup completed",
                "shipment picked up",
                "shipped",
                "in transit"
        );
    }

    private boolean isOutForDeliveryStatus(
            String normalizedStatus
    ) {
        if (
                isCancellationStatus(
                        normalizedStatus
                )
                        || isReturnStatus(
                        normalizedStatus
                )
                        || isDeliveryFailureStatus(
                        normalizedStatus
                )
        ) {
            return false;
        }

        return "ofd".equals(
                normalizedStatus
        )
                || equalsOrStartsWith(
                normalizedStatus,
                "out for delivery"
        );
    }

    private boolean isCancellationStatus(
            String normalizedStatus
    ) {
        return normalizedStatus.contains(
                "cancel"
        );
    }

    private boolean isReturnStatus(
            String normalizedStatus
    ) {
        return normalizedStatus.startsWith(
                "rto"
        )
                || normalizedStatus.contains(
                "return to origin"
        )
                || normalizedStatus.startsWith(
                "return"
        );
    }

    private boolean isDeliveryFailureStatus(
            String normalizedStatus
    ) {
        return "undelivered".equals(
                normalizedStatus
        )
                || normalizedStatus.startsWith(
                "undelivered "
        )
                || normalizedStatus.startsWith(
                "not delivered"
        )
                || normalizedStatus.contains(
                "delivery failed"
        );
    }

    private boolean equalsOrStartsWith(
            String value,
            String... expectedValues
    ) {
        if (
                value == null
                        || expectedValues == null
        ) {
            return false;
        }

        for (String expected : expectedValues) {
            if (
                    value.equals(
                            expected
                    )
                            || value.startsWith(
                            expected + " "
                    )
            ) {
                return true;
            }
        }

        return false;
    }

    private Long extractShiprocketOrderId(
            JsonNode response
    ) {
        return findLongAny(
                response,
                "order_id",
                "shiprocket_order_id"
        );
    }

    private Long extractShipmentId(
            JsonNode response
    ) {
        Long direct =
                findLongAny(
                        response,
                        "shipment_id",
                        "shiprocket_shipment_id",
                        "shipmentId"
                );

        if (direct != null) {
            return direct;
        }

        JsonNode shipmentNode =
                findNode(
                        response,
                        "shipment"
                );

        if (shipmentNode != null) {
            Long fromShipment =
                    findLongAny(
                            shipmentNode,
                            "id",
                            "shipment_id",
                            "shipmentId"
                    );

            if (fromShipment != null) {
                return fromShipment;
            }
        }

        JsonNode shipmentsNode =
                findNode(
                        response,
                        "shipments"
                );

        if (
                shipmentsNode != null
                        && shipmentsNode.isArray()
                        && shipmentsNode.size() > 0
        ) {
            return findLongAny(
                    shipmentsNode.get(0),
                    "id",
                    "shipment_id",
                    "shipmentId"
            );
        }

        return null;
    }

    private String extractTrackingStatus(
            JsonNode payload
    ) {
        return firstNonBlank(
                findTextAny(
                        payload,
                        "current_status",
                        "shipment_status",
                        "shipment_track_status",
                        "tracking_status",
                        "track_status",
                        "activity"
                ),
                findTextAny(
                        payload,
                        "status",
                        "message"
                )
        );
    }

    private String extractTrackingStatusCode(
            JsonNode payload
    ) {
        return findTextAny(
                payload,
                "current_status_code",
                "shipment_status_id",
                "shipment_track_status_id",
                "sr-status",
                "sr_status",
                "status_code",
                "statusCode",
                "code"
        );
    }

    private String extractTrackingLocation(
            JsonNode payload
    ) {
        return findTextAny(
                payload,
                "location",
                "current_location",
                "scan_location",
                "city"
        );
    }

    private String extractTrackingActivity(
            JsonNode payload
    ) {
        return findTextAny(
                payload,
                "activity",
                "status_description",
                "description",
                "remark",
                "remarks",
                "message"
        );
    }

    private OffsetDateTime findDateAny(
            JsonNode root,
            String... fieldNames
    ) {
        if (fieldNames == null) {
            return null;
        }

        for (String fieldName : fieldNames) {
            String value =
                    findText(
                            root,
                            fieldName
                    );

            OffsetDateTime parsed =
                    parseDateTime(
                            value
                    );

            if (parsed != null) {
                return parsed;
            }
        }

        return null;
    }

    private OffsetDateTime parseDateTime(
            String value
    ) {
        if (isBlank(value)) {
            return null;
        }

        String text =
                value
                        .trim()
                        .replace("T", " ");

        try {
            return OffsetDateTime.parse(
                    value.trim()
            );

        } catch (Exception ignored) {
        }

        try {
            return ZonedDateTime
                    .parse(
                            value.trim()
                    )
                    .toOffsetDateTime();

        } catch (Exception ignored) {
        }

        for (DateTimeFormatter formatter : DATE_TIME_FORMATTERS) {
            try {
                LocalDateTime localDateTime =
                        LocalDateTime.parse(
                                text,
                                formatter
                        );

                return localDateTime
                        .atZone(
                                INDIA_ZONE
                        )
                        .toOffsetDateTime();

            } catch (Exception ignored) {
            }
        }

        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                LocalDate localDate =
                        LocalDate.parse(
                                text,
                                formatter
                        );

                return localDate
                        .atStartOfDay(
                                INDIA_ZONE
                        )
                        .toOffsetDateTime();

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    private Long findLongAny(
            JsonNode root,
            String... fieldNames
    ) {
        if (fieldNames == null) {
            return null;
        }

        for (String fieldName : fieldNames) {
            Long value =
                    findLong(
                            root,
                            fieldName
                    );

            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private String findTextAny(
            JsonNode root,
            String... fieldNames
    ) {
        if (fieldNames == null) {
            return null;
        }

        for (String fieldName : fieldNames) {
            String value =
                    findText(
                            root,
                            fieldName
                    );

            if (!isBlank(value)) {
                return value;
            }
        }

        return null;
    }

    private Long findLong(
            JsonNode root,
            String fieldName
    ) {
        String text =
                findText(
                        root,
                        fieldName
                );

        if (isBlank(text)) {
            return null;
        }

        try {
            return Long.valueOf(
                    text
                );

        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String findDirectText(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
                        || !root.isObject()
                        || !root.hasNonNull(fieldName)
        ) {
            return null;
        }

        return root
                .get(
                        fieldName
                )
                .asText();
    }

    private String findText(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
        ) {
            return null;
        }

        if (
                root.isObject()
                        && root.hasNonNull(fieldName)
        ) {
            return root
                    .get(
                            fieldName
                    )
                    .asText();
        }

        if (root.isObject()) {
            Iterator<JsonNode> children =
                    root.elements();

            while (children.hasNext()) {
                String value =
                        findText(
                                children.next(),
                                fieldName
                        );

                if (!isBlank(value)) {
                    return value;
                }
            }
        }

        if (root.isArray()) {
            for (JsonNode child : root) {
                String value =
                        findText(
                                child,
                                fieldName
                        );

                if (!isBlank(value)) {
                    return value;
                }
            }
        }

        return null;
    }

    private JsonNode findNode(
            JsonNode root,
            String fieldName
    ) {
        if (
                root == null
                        || fieldName == null
        ) {
            return null;
        }

        if (
                root.isObject()
                        && root.hasNonNull(fieldName)
        ) {
            return root.get(
                    fieldName
            );
        }

        if (root.isObject()) {
            Iterator<JsonNode> children =
                    root.elements();

            while (children.hasNext()) {
                JsonNode found =
                        findNode(
                                children.next(),
                                fieldName
                        );

                if (found != null) {
                    return found;
                }
            }
        }

        if (root.isArray()) {
            for (JsonNode child : root) {
                JsonNode found =
                        findNode(
                                child,
                                fieldName
                        );

                if (found != null) {
                    return found;
                }
            }
        }

        return null;
    }

    private String toJson(
            Object value
    ) {
        try {
            return objectMapper
                    .writeValueAsString(
                            value
                    );

        } catch (Exception exception) {
            return String.valueOf(
                    value
            );
        }
    }

    private String mergeResponseJson(
            String existingJson,
            String key,
            JsonNode response
    ) {
        ObjectNode root = objectMapper.createObjectNode();

        if (!isBlank(existingJson)) {
            try {
                JsonNode existing = objectMapper.readTree(existingJson);

                if (
                        existing != null
                                && existing.isObject()
                                && existing.has("events")
                                && existing.get("events").isArray()
                ) {
                    root = (ObjectNode) existing.deepCopy();

                } else if (existing != null) {
                    root.set("initial", existing);
                }

            } catch (Exception exception) {
                root.put(
                        "initialText",
                        truncateText(
                                existingJson,
                                Math.min(
                                        20000,
                                        properties.getMaxStoredPayloadChars() / 4
                                )
                        )
                );
            }
        }

        ArrayNode events = root.withArray("events");

        ObjectNode event = objectMapper.createObjectNode();
        event.put(
                "type",
                firstNonBlank(key, "providerResponse")
        );
        event.put("savedAt", OffsetDateTime.now().toString());
        event.set(
                "payload",
                response != null
                        ? response
                        : objectMapper.nullNode()
        );

        events.add(event);

        int maxEvents = Math.max(1, properties.getMaxStoredEvents());

        while (events.size() > maxEvents) {
            events.remove(0);
        }

        int maxChars =
                Math.max(
                        1000,
                        properties.getMaxStoredPayloadChars()
                );

        String serialized = toJson(root);

        while (
                serialized.length() > maxChars
                        && events.size() > 1
        ) {
            events.remove(0);
            serialized = toJson(root);
        }

        if (serialized.length() > maxChars) {
            root.remove("initial");
            root.remove("initialText");
            serialized = toJson(root);
        }

        if (serialized.length() > maxChars) {
            ObjectNode compact = objectMapper.createObjectNode();
            compact.put("truncated", true);
            compact.put(
                    "type",
                    firstNonBlank(key, "providerResponse")
            );
            compact.put("savedAt", OffsetDateTime.now().toString());
            compact.put(
                    "payloadText",
                    truncateText(
                            response != null
                                    ? response.toString()
                                    : "null",
                            Math.max(100, maxChars - 500)
                    )
            );
            return toJson(compact);
        }

        return serialized;
    }

    private void validateProviderPayloadSize(
            JsonNode payload,
            String payloadName
    ) {
        if (payload == null) {
            return;
        }

        int maxChars =
                Math.max(
                        1000,
                        properties.getMaxStoredPayloadChars()
                );

        if (payload.toString().length() > maxChars) {
            throw new RuntimeException(
                    "Shiprocket " + payloadName + " is too large"
            );
        }
    }

    private String truncateText(
            String value,
            int maxChars
    ) {
        if (value == null || value.length() <= maxChars) {
            return value;
        }

        return value.substring(0, maxChars);
    }

    public static class InvalidWebhookSecretException extends RuntimeException {

        public InvalidWebhookSecretException(
                String message
        ) {
            super(
                    message
            );
        }
    }
}