package com.mydev.ecommerce.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mydev.ecommerce.address.model.Address;
import com.mydev.ecommerce.address.repository.AddressRepository;
import com.mydev.ecommerce.cart.model.Cart;
import com.mydev.ecommerce.cart.model.CartItem;
import com.mydev.ecommerce.cart.repository.CartRepository;
import com.mydev.ecommerce.coupon.dto.CouponCalculationResult;
import com.mydev.ecommerce.coupon.service.CouponService;
import com.mydev.ecommerce.email.dto.OrderEmailPayload;
import com.mydev.ecommerce.email.service.OrderEmailService;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.order.model.OrderItem;
import com.mydev.ecommerce.order.model.OrderStatus;
import com.mydev.ecommerce.order.model.PaymentMethod;
import com.mydev.ecommerce.order.model.PaymentStatus;
import com.mydev.ecommerce.order.repository.OrderRepository;
import com.mydev.ecommerce.payment.dto.CreateRazorpayOrderRequest;
import com.mydev.ecommerce.payment.dto.CreateRazorpayOrderResponse;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentRequest;
import com.mydev.ecommerce.payment.dto.VerifyRazorpayPaymentResponse;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Refund;
import com.razorpay.Utils;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private static final String INR = "INR";

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final CouponService couponService;
    private final OrderEmailService orderEmailService;
    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.webhook-secret}")
    private String razorpayWebhookSecret;

    public CreateRazorpayOrderResponse createRazorpayOrder(
            Authentication authentication,
            CreateRazorpayOrderRequest request
    ) {
        User user = getUser(authentication);

        Address address = addressRepository
                .findByIdAndUserId(request.addressId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Cart cart = cartRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setPaymentMethod(PaymentMethod.ONLINE);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setStatus(OrderStatus.PLACED);

        setAddress(order, address);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getProduct() == null) {
                throw new RuntimeException("Cart product not found");
            }

            if (cartItem.getProduct().getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + cartItem.getProduct().getTitle()
                );
            }

            OrderItem orderItem = buildOrderItem(order, cartItem);
            order.getItems().add(orderItem);

            subtotal = subtotal.add(orderItem.getLineTotal());
        }

        BigDecimal shipping = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal total = subtotal.add(shipping);

        boolean hasCoupon =
                request.couponCode() != null
                        && !request.couponCode().isBlank();

        CouponCalculationResult couponResult = null;

        if (hasCoupon) {
            couponResult =
                    couponService.validateAndCalculate(
                            request.couponCode().trim(),
                            subtotal
                    );

            discount = couponResult.discountAmount();
            total = subtotal.add(shipping).subtract(discount);
        }

        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Order total must be greater than zero for online payment"
            );
        }

        order.setSubtotalAmount(subtotal);
        order.setShippingAmount(shipping);
        order.setDiscountAmount(discount);
        order.setTotalAmount(total);
        order.setCouponCode(
                hasCoupon
                        ? couponResult.coupon().getCode()
                        : null
        );

        Order savedOrder = orderRepository.save(order);

        long amountPaise = toPaise(savedOrder.getTotalAmount());

        try {
            JSONObject options = new JSONObject();
            options.put("amount", amountPaise);
            options.put("currency", INR);
            options.put("receipt", savedOrder.getOrderNumber());

            JSONObject notes = new JSONObject();
            notes.put("local_order_id", String.valueOf(savedOrder.getId()));
            notes.put("order_number", savedOrder.getOrderNumber());

            if (hasText(savedOrder.getCouponCode())) {
                notes.put("coupon_code", savedOrder.getCouponCode());
            }

            options.put("notes", notes);

            com.razorpay.Order razorpayOrder =
                    getRazorpayClient().orders.create(options);

            String razorpayOrderId = razorpayOrder.get("id");

            savedOrder.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(savedOrder);

            log.info(
                    "Razorpay order created -> localOrderId={}, orderNumber={}, razorpayOrderId={}, amountPaise={}",
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    razorpayOrderId,
                    amountPaise
            );

            return new CreateRazorpayOrderResponse(
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    razorpayOrderId,
                    BigDecimal.valueOf(amountPaise),
                    INR,
                    razorpayKeyId
            );

        } catch (Exception exception) {
            log.error(
                    "Razorpay order creation failed -> localOrderId={}, orderNumber={}, reason={}",
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    exception.getMessage(),
                    exception
            );

            throw new RuntimeException(
                    "Failed to create Razorpay order. Please try again.",
                    exception
            );
        }
    }

    public VerifyRazorpayPaymentResponse verifyRazorpayPayment(
            Authentication authentication,
            VerifyRazorpayPaymentRequest request
    ) {
        User user = getUser(authentication);

        Order order = orderRepository
                .findLockedByIdAndUserId(request.orderId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!hasText(order.getRazorpayOrderId())) {
            throw new RuntimeException("Razorpay order is missing for this order");
        }

        if (!Objects.equals(order.getRazorpayOrderId(), request.razorpayOrderId())) {
            throw new RuntimeException("Razorpay order mismatch");
        }

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            clearCart(user.getId());

            return new VerifyRazorpayPaymentResponse(
                    "Payment already verified.",
                    order.getId(),
                    order.getOrderNumber(),
                    order.getPaymentStatus().name()
            );
        }

        verifyCheckoutSignature(
                order.getRazorpayOrderId(),
                request.razorpayPaymentId(),
                request.razorpaySignature()
        );

        RazorpayPaymentInfo paymentInfo =
                fetchAndValidatePaymentFromRazorpay(
                        order,
                        request.razorpayPaymentId()
                );

        PaymentConfirmationResult result =
                confirmPaidOrder(
                        order,
                        request.razorpayPaymentId(),
                        request.razorpaySignature(),
                        paymentInfo.amountPaise(),
                        true
                );

        return new VerifyRazorpayPaymentResponse(
                result.message(),
                order.getId(),
                order.getOrderNumber(),
                order.getPaymentStatus().name()
        );
    }

    public void handleRazorpayWebhook(
            String rawPayload,
            String razorpaySignature
    ) {
        verifyWebhookSignature(rawPayload, razorpaySignature);

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String event = root.path("event").asText("");

            switch (event) {
                case "payment.captured" -> handlePaymentCapturedWebhook(root);
                case "order.paid" -> handleOrderPaidWebhook(root);
                case "payment.failed" -> handlePaymentFailedWebhook(root);
                default -> log.info("Ignored Razorpay webhook event={}", event);
            }

        } catch (Exception exception) {
            log.error(
                    "Razorpay webhook processing failed -> reason={}",
                    exception.getMessage(),
                    exception
            );

            throw new RuntimeException(
                    "Webhook processing failed",
                    exception
            );
        }
    }

    private void handlePaymentCapturedWebhook(JsonNode root) {
        JsonNode payment =
                root.path("payload")
                        .path("payment")
                        .path("entity");

        String razorpayOrderId =
                textOrNull(payment.path("order_id"));

        String razorpayPaymentId =
                textOrNull(payment.path("id"));

        Long amountPaise =
                payment.path("amount").isNumber()
                        ? payment.path("amount").asLong()
                        : null;

        if (!hasText(razorpayOrderId)) {
            log.warn("payment.captured webhook ignored because order_id is missing");
            return;
        }

        Order order = orderRepository
                .findLockedByRazorpayOrderId(razorpayOrderId)
                .orElse(null);

        if (order == null) {
            log.warn(
                    "payment.captured webhook ignored because local order not found -> razorpayOrderId={}",
                    razorpayOrderId
            );
            return;
        }

        confirmPaidOrder(
                order,
                razorpayPaymentId,
                null,
                amountPaise,
                false
        );
    }

    private void handleOrderPaidWebhook(JsonNode root) {
        JsonNode orderEntity =
                root.path("payload")
                        .path("order")
                        .path("entity");

        JsonNode paymentEntity =
                root.path("payload")
                        .path("payment")
                        .path("entity");

        String razorpayOrderId =
                textOrNull(orderEntity.path("id"));

        String razorpayPaymentId =
                textOrNull(paymentEntity.path("id"));

        Long amountPaise =
                orderEntity.path("amount_paid").isNumber()
                        ? orderEntity.path("amount_paid").asLong()
                        : null;

        if (!hasText(razorpayOrderId)) {
            log.warn("order.paid webhook ignored because order id is missing");
            return;
        }

        Order order = orderRepository
                .findLockedByRazorpayOrderId(razorpayOrderId)
                .orElse(null);

        if (order == null) {
            log.warn(
                    "order.paid webhook ignored because local order not found -> razorpayOrderId={}",
                    razorpayOrderId
            );
            return;
        }

        confirmPaidOrder(
                order,
                razorpayPaymentId,
                null,
                amountPaise,
                false
        );
    }

    private void handlePaymentFailedWebhook(JsonNode root) {
        JsonNode payment =
                root.path("payload")
                        .path("payment")
                        .path("entity");

        String razorpayOrderId =
                textOrNull(payment.path("order_id"));

        String razorpayPaymentId =
                textOrNull(payment.path("id"));

        if (!hasText(razorpayOrderId)) {
            log.warn("payment.failed webhook ignored because order_id is missing");
            return;
        }

        Order order = orderRepository
                .findLockedByRazorpayOrderId(razorpayOrderId)
                .orElse(null);

        if (order == null) {
            log.warn(
                    "payment.failed webhook ignored because local order not found -> razorpayOrderId={}",
                    razorpayOrderId
            );
            return;
        }

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            log.info(
                    "payment.failed webhook ignored because order is already paid -> orderNumber={}",
                    order.getOrderNumber()
            );
            return;
        }

        if (hasText(razorpayPaymentId)) {
            order.setRazorpayPaymentId(razorpayPaymentId);
        }

        order.setPaymentStatus(PaymentStatus.FAILED);
        orderRepository.save(order);

        log.warn(
                "Razorpay payment failed -> orderNumber={}, razorpayOrderId={}, razorpayPaymentId={}",
                order.getOrderNumber(),
                razorpayOrderId,
                razorpayPaymentId
        );
    }

    private PaymentConfirmationResult confirmPaidOrder(
            Order order,
            String razorpayPaymentId,
            String razorpaySignature,
            Long paidAmountPaise,
            boolean clearCart
    ) {
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return new PaymentConfirmationResult(
                    "Payment already verified."
            );
        }

        if (paidAmountPaise != null) {
            long expectedAmountPaise = toPaise(order.getTotalAmount());

            if (paidAmountPaise != expectedAmountPaise) {
                order.setPaymentStatus(PaymentStatus.FAILED);
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);

                if (hasText(razorpayPaymentId)) {
                    tryCreateNormalRefund(
                            razorpayPaymentId,
                            paidAmountPaise,
                            "AMOUNT-MISMATCH-" + order.getOrderNumber(),
                            "Payment amount mismatch"
                    );
                }

                log.error(
                        "Razorpay amount mismatch -> orderNumber={}, expectedPaise={}, paidPaise={}",
                        order.getOrderNumber(),
                        expectedAmountPaise,
                        paidAmountPaise
                );

                return new PaymentConfirmationResult(
                        "Payment amount mismatch. Order was cancelled and refund was initiated or requires admin review."
                );
            }
        }

        if (hasText(razorpayPaymentId)) {
            boolean paymentUsedByOtherOrder =
                    orderRepository.existsByRazorpayPaymentIdAndIdNot(
                            razorpayPaymentId,
                            order.getId()
                    );

            if (paymentUsedByOtherOrder) {
                throw new RuntimeException(
                        "This Razorpay payment is already linked to another order"
                );
            }

            if (
                    hasText(order.getRazorpayPaymentId())
                            && !Objects.equals(order.getRazorpayPaymentId(), razorpayPaymentId)
            ) {
                throw new RuntimeException("Razorpay payment mismatch");
            }

            order.setRazorpayPaymentId(razorpayPaymentId);
        }

        if (hasText(razorpaySignature)) {
            order.setRazorpaySignature(razorpaySignature);
        }

        boolean stockReduced = reduceStockAtomically(order);

        if (!stockReduced) {
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            if (hasText(razorpayPaymentId)) {
                tryCreateNormalRefund(
                        razorpayPaymentId,
                        toPaise(order.getTotalAmount()),
                        "REFUND-" + order.getOrderNumber(),
                        "Stock unavailable after payment"
                );
            }

            log.error(
                    "Paid order cancelled because stock became unavailable -> orderNumber={}, paymentId={}",
                    order.getOrderNumber(),
                    razorpayPaymentId
            );

            return new PaymentConfirmationResult(
                    "Payment captured, but stock became unavailable. Refund has been initiated or requires admin review."
            );
        }

        boolean couponConsumed =
                consumeCouponForPaidOrder(order);

        if (!couponConsumed) {
            restoreStock(
                    new ArrayList<>(order.getItems())
            );

            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            if (hasText(razorpayPaymentId)) {
                tryCreateNormalRefund(
                        razorpayPaymentId,
                        toPaise(order.getTotalAmount()),
                        "COUPON-FAILED-" + order.getOrderNumber(),
                        "Coupon validation failed after payment"
                );
            }

            log.error(
                    "Paid order cancelled because coupon consumption failed -> orderNumber={}, paymentId={}",
                    order.getOrderNumber(),
                    razorpayPaymentId
            );

            return new PaymentConfirmationResult(
                    "Payment captured, but coupon validation failed. Refund has been initiated or requires admin review."
            );
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);

        orderRepository.save(order);

        if (clearCart && order.getUser() != null) {
            clearCart(order.getUser().getId());
        }

        sendPaidOrderEmails(order);

        log.info(
                "Razorpay payment confirmed -> orderNumber={}, paymentId={}",
                order.getOrderNumber(),
                razorpayPaymentId
        );

        return new PaymentConfirmationResult(
                "Payment successful. Your order has been confirmed."
        );
    }

    private boolean consumeCouponForPaidOrder(Order order) {
        if (!hasText(order.getCouponCode())) {
            return true;
        }

        if (order.getUser() == null) {
            log.error(
                    "Coupon consume failed because user is missing -> orderNumber={}, couponCode={}",
                    order.getOrderNumber(),
                    order.getCouponCode()
            );
            return false;
        }

        try {
            CouponCalculationResult couponResult =
                    couponService.validateAndCalculate(
                            order.getCouponCode(),
                            order.getSubtotalAmount()
                    );

            couponService.consumeCoupon(
                    couponResult.coupon(),
                    order.getUser(),
                    order
            );

            log.info(
                    "Coupon consumed for paid Razorpay order -> orderNumber={}, couponCode={}",
                    order.getOrderNumber(),
                    order.getCouponCode()
            );

            return true;

        } catch (Exception exception) {
            log.error(
                    "Coupon consume failed after Razorpay payment -> orderNumber={}, couponCode={}, reason={}",
                    order.getOrderNumber(),
                    order.getCouponCode(),
                    exception.getMessage(),
                    exception
            );

            return false;
        }
    }

    private void verifyCheckoutSignature(
            String savedRazorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", savedRazorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean valid =
                    Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!valid) {
                throw new RuntimeException("Invalid payment signature");
            }

        } catch (Exception exception) {
            throw new RuntimeException("Invalid payment signature", exception);
        }
    }

    private void verifyWebhookSignature(
            String rawPayload,
            String razorpaySignature
    ) {
        if (!hasText(razorpayWebhookSecret)) {
            throw new RuntimeException("Razorpay webhook secret is missing");
        }

        if (!hasText(rawPayload) || !hasText(razorpaySignature)) {
            throw new RuntimeException("Webhook payload or signature is missing");
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKeySpec =
                    new SecretKeySpec(
                            razorpayWebhookSecret.getBytes(StandardCharsets.UTF_8),
                            "HmacSHA256"
                    );

            mac.init(secretKeySpec);

            byte[] digest =
                    mac.doFinal(rawPayload.getBytes(StandardCharsets.UTF_8));

            String expectedSignature =
                    HexFormat.of().formatHex(digest);

            boolean valid =
                    MessageDigest.isEqual(
                            expectedSignature.getBytes(StandardCharsets.UTF_8),
                            razorpaySignature.trim().getBytes(StandardCharsets.UTF_8)
                    );

            if (!valid) {
                throw new RuntimeException("Invalid Razorpay webhook signature");
            }

        } catch (Exception exception) {
            throw new RuntimeException("Invalid Razorpay webhook signature", exception);
        }
    }

    private RazorpayPaymentInfo fetchAndValidatePaymentFromRazorpay(
            Order order,
            String razorpayPaymentId
    ) {
        try {
            Payment payment =
                    getRazorpayClient().payments.fetch(razorpayPaymentId);

            String paymentOrderId =
                    String.valueOf(payment.get("order_id"));

            String status =
                    String.valueOf(payment.get("status"));

            Object amountObject =
                    payment.get("amount");

            if (!(amountObject instanceof Number amountNumber)) {
                throw new RuntimeException("Razorpay payment amount is missing");
            }

            long amountPaise =
                    amountNumber.longValue();

            if (!Objects.equals(order.getRazorpayOrderId(), paymentOrderId)) {
                throw new RuntimeException("Razorpay payment order mismatch");
            }

            if (!"captured".equalsIgnoreCase(status)) {
                throw new RuntimeException("Payment is not captured yet");
            }

            long expectedAmountPaise = toPaise(order.getTotalAmount());

            if (amountPaise != expectedAmountPaise) {
                order.setPaymentStatus(PaymentStatus.FAILED);
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);

                tryCreateNormalRefund(
                        razorpayPaymentId,
                        amountPaise,
                        "AMOUNT-MISMATCH-" + order.getOrderNumber(),
                        "Payment amount mismatch"
                );

                throw new RuntimeException("Razorpay payment amount mismatch");
            }

            return new RazorpayPaymentInfo(
                    razorpayPaymentId,
                    paymentOrderId,
                    status,
                    amountPaise
            );

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Unable to verify payment status from Razorpay",
                    exception
            );
        }
    }

    private boolean reduceStockAtomically(Order order) {
        List<OrderItem> reducedItems = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            if (item.getProduct() == null || item.getProduct().getId() == null) {
                restoreStock(reducedItems);

                throw new RuntimeException(
                        "Product is missing for item: " + item.getProductTitle()
                );
            }

            int updated =
                    entityManager
                            .createNativeQuery("""
                                    UPDATE products
                                    SET stock = stock - :quantity
                                    WHERE id = :productId
                                      AND stock >= :quantity
                                    """)
                            .setParameter("quantity", item.getQuantity())
                            .setParameter("productId", item.getProduct().getId())
                            .executeUpdate();

            if (updated != 1) {
                restoreStock(reducedItems);

                log.warn(
                        "Stock reduction failed -> orderNumber={}, productId={}, quantity={}",
                        order.getOrderNumber(),
                        item.getProduct().getId(),
                        item.getQuantity()
                );

                return false;
            }

            reducedItems.add(item);
        }

        return true;
    }

    private void restoreStock(List<OrderItem> reducedItems) {
        for (OrderItem item : reducedItems) {
            if (item.getProduct() == null || item.getProduct().getId() == null) {
                continue;
            }

            entityManager
                    .createNativeQuery("""
                            UPDATE products
                            SET stock = stock + :quantity
                            WHERE id = :productId
                            """)
                    .setParameter("quantity", item.getQuantity())
                    .setParameter("productId", item.getProduct().getId())
                    .executeUpdate();
        }
    }

    private void tryCreateNormalRefund(
            String razorpayPaymentId,
            long amountPaise,
            String receipt,
            String reason
    ) {
        try {
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", amountPaise);
            refundRequest.put("speed", "normal");
            refundRequest.put("receipt", receipt);

            JSONObject notes = new JSONObject();
            notes.put(
                    "reason",
                    hasText(reason)
                            ? reason
                            : "Order cancelled after payment"
            );
            refundRequest.put("notes", notes);

            Refund refund =
                    getRazorpayClient()
                            .payments
                            .refund(razorpayPaymentId, refundRequest);

            log.warn(
                    "Razorpay refund created -> paymentId={}, refundId={}, amountPaise={}",
                    razorpayPaymentId,
                    refund.get("id"),
                    amountPaise
            );

        } catch (Exception exception) {
            log.error(
                    "Automatic Razorpay refund failed -> paymentId={}, amountPaise={}, reason={}",
                    razorpayPaymentId,
                    amountPaise,
                    exception.getMessage(),
                    exception
            );
        }
    }

    private void clearCart(Long userId) {
        Cart cart =
                cartRepository
                        .findByUserId(userId)
                        .orElse(null);

        if (cart != null && cart.getItems() != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }

    private void sendPaidOrderEmails(Order order) {
        try {
            OrderEmailPayload emailPayload =
                    buildOrderEmailPayload(order);

            orderEmailService
                    .sendPaidOrderConfirmedCustomerEmail(emailPayload);

            orderEmailService
                    .sendOrderAdminNotification(
                            emailPayload,
                            "New prepaid order confirmed."
                    );

        } catch (Exception exception) {
            log.error(
                    "Paid order email failed -> orderNumber={}, reason={}",
                    order.getOrderNumber(),
                    exception.getMessage(),
                    exception
            );
        }
    }

    private OrderEmailPayload buildOrderEmailPayload(Order order) {
        User user = order.getUser();

        return OrderEmailPayload.builder()
                .customerName(user != null ? user.getName() : order.getAddressFullName())
                .customerEmail(user != null ? user.getEmail() : null)
                .orderNumber(order.getOrderNumber())
                .orderStatus(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .subtotalAmount(order.getSubtotalAmount())
                .shippingAmount(order.getShippingAmount())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .couponCode(order.getCouponCode())
                .addressFullName(order.getAddressFullName())
                .addressPhone(order.getAddressPhone())
                .addressLine1(order.getAddressLine1())
                .addressLine2(order.getAddressLine2())
                .addressCity(order.getAddressCity())
                .addressState(order.getAddressState())
                .addressPincode(order.getAddressPincode())
                .addressCountry(order.getAddressCountry())
                .createdAt(order.getCreatedAt())
                .items(order.getItems()
                        .stream()
                        .map(item ->
                                OrderEmailPayload
                                        .OrderEmailItemPayload
                                        .builder()
                                        .productTitle(item.getProductTitle())
                                        .quantity(item.getQuantity())
                                        .unitPrice(item.getUnitPrice())
                                        .lineTotal(item.getLineTotal())
                                        .imageUrl(item.getImageUrl())
                                        .build()
                        )
                        .toList())
                .build();
    }

    private void setAddress(Order order, Address address) {
        order.setAddressFullName(address.getFullName());
        order.setAddressPhone(address.getPhone());
        order.setAddressLine1(address.getLine1());
        order.setAddressLine2(address.getLine2());
        order.setAddressCity(address.getCity());
        order.setAddressState(address.getState());
        order.setAddressPincode(address.getPincode());
        order.setAddressCountry(address.getCountry());
    }

    private OrderItem buildOrderItem(
            Order order,
            CartItem cartItem
    ) {
        OrderItem item = new OrderItem();

        item.setOrder(order);
        item.setProduct(cartItem.getProduct());
        item.setProductTitle(cartItem.getProduct().getTitle());
        item.setQuantity(cartItem.getQuantity());

        BigDecimal unitPrice = cartItem.getUnitPriceSnapshot();

        if (unitPrice == null) {
            throw new RuntimeException(
                    "Product price is missing for: "
                            + cartItem.getProduct().getTitle()
            );
        }

        BigDecimal lineTotal =
                unitPrice.multiply(
                        BigDecimal.valueOf(cartItem.getQuantity())
                );

        item.setUnitPrice(unitPrice);
        item.setLineTotal(lineTotal);

        if (
                cartItem.getProduct().getImages() != null
                        && !cartItem.getProduct().getImages().isEmpty()
        ) {
            item.setImageUrl(
                    cartItem
                            .getProduct()
                            .getImages()
                            .get(0)
                            .getImageUrl()
            );
        }

        return item;
    }

    private User getUser(Authentication authentication) {
        if (
                authentication == null
                        || authentication.getName() == null
                        || authentication.getName().isBlank()
        ) {
            throw new RuntimeException("Authentication is required");
        }

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private RazorpayClient getRazorpayClient() throws Exception {
        if (!hasText(razorpayKeyId) || !hasText(razorpayKeySecret)) {
            throw new RuntimeException("Razorpay keys are missing");
        }

        return new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    private long toPaise(BigDecimal amount) {
        if (amount == null) {
            throw new RuntimeException("Order amount is missing");
        }

        return amount
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    private String generateOrderNumber() {
        return "TF-"
                + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10)
                .toUpperCase(Locale.ROOT);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String textOrNull(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return null;
        }

        String value = node.asText();

        return hasText(value) ? value : null;
    }

    private record RazorpayPaymentInfo(
            String paymentId,
            String orderId,
            String status,
            Long amountPaise
    ) {
    }

    private record PaymentConfirmationResult(
            String message
    ) {
    }
}