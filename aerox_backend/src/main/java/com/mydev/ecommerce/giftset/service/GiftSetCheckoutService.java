
package com.mydev.ecommerce.giftset.service;

import com.mydev.ecommerce.address.model.Address;
import com.mydev.ecommerce.address.repository.AddressRepository;
import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.giftset.dto.*;
import com.mydev.ecommerce.giftset.model.GiftSetCart;
import com.mydev.ecommerce.giftset.model.GiftSetCartItem;
import com.mydev.ecommerce.giftset.model.GiftSetOrder;
import com.mydev.ecommerce.giftset.model.GiftSetOrderItem;
import com.mydev.ecommerce.giftset.repository.GiftSetCartRepository;
import com.mydev.ecommerce.giftset.repository.GiftSetOrderRepository;
import com.mydev.ecommerce.order.model.OrderStatus;
import com.mydev.ecommerce.order.model.PaymentMethod;
import com.mydev.ecommerce.order.model.PaymentStatus;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GiftSetCheckoutService {

    private final GiftSetCartRepository giftSetCartRepository;
    private final GiftSetOrderRepository giftSetOrderRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Transactional
    public GiftSetOrderResponse placeOrder(Authentication authentication, PlaceGiftSetOrderRequest request) {
        User user = getRequiredUser(authentication);
        Address address = getRequiredAddress(user.getId(), request.addressId());

        PaymentMethod paymentMethod = parsePaymentMethod(request.paymentMethod());
        if (paymentMethod != PaymentMethod.COD) {
            throw new IllegalArgumentException("Use gift set Razorpay endpoint for online payment");
        }

        GiftSetCart cart = getRequiredCart(user.getId());
        CartAmounts amounts = validateAndComputeCart(cart);

        GiftSetOrder order = buildBaseOrder(user, address, request.couponCode(), paymentMethod, amounts);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setStatus(OrderStatus.CONFIRMED);

        for (GiftSetCartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            GiftBox giftBox = cartItem.getGiftBox();

            validateProduct(product);
            validateGiftBox(giftBox);

            if (product.getStock() == null || product.getStock() < 1) {
                throw new IllegalArgumentException("Product is out of stock: " + product.getTitle());
            }
            if (giftBox.getStock() == null || giftBox.getStock() < 1) {
                throw new IllegalArgumentException("Gift box is out of stock: " + giftBox.getName());
            }

            product.setStock(product.getStock() - 1);
            giftBox.setStock(giftBox.getStock() - 1);

            GiftSetOrderItem orderItem = buildOrderItem(order, cartItem);
            order.getItems().add(orderItem);
        }

        GiftSetOrder saved = giftSetOrderRepository.save(order);
        cart.getItems().clear();
        giftSetCartRepository.save(cart);

        return toResponse(saved);
    }

    @Transactional
    public CreateGiftSetRazorpayOrderResponse createRazorpayOrder(
            Authentication authentication,
            CreateGiftSetRazorpayOrderRequest request
    ) {
        User user = getRequiredUser(authentication);
        Address address = getRequiredAddress(user.getId(), request.addressId());
        GiftSetCart cart = getRequiredCart(user.getId());
        CartAmounts amounts = validateAndComputeCart(cart);

        GiftSetOrder order = buildBaseOrder(user, address, request.couponCode(), PaymentMethod.ONLINE, amounts);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setStatus(OrderStatus.CONFIRMED);

        GiftSetOrder saved = giftSetOrderRepository.save(order);

        try {
            JSONObject payload = new JSONObject();
            payload.put("amount", saved.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValueExact());
            payload.put("currency", "INR");
            payload.put("receipt", saved.getOrderNumber());

            Order razorpayOrder = razorpayClient.orders.create(payload);
            saved.setRazorpayOrderId(razorpayOrder.get("id"));
            giftSetOrderRepository.save(saved);

            return new CreateGiftSetRazorpayOrderResponse(
                    saved.getId(),
                    saved.getOrderNumber(),
                    saved.getRazorpayOrderId(),
                    saved.getTotalAmount(),
                    "INR",
                    razorpayKeyId
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to create Razorpay order");
        }
    }

    @Transactional
    public VerifyGiftSetRazorpayPaymentResponse verifyRazorpayPayment(
            Authentication authentication,
            VerifyGiftSetRazorpayPaymentRequest request
    ) {
        User user = getRequiredUser(authentication);
        GiftSetOrder order = giftSetOrderRepository.findByIdAndUserId(request.orderId(), user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Gift set order not found"));

        if (order.getPaymentMethod() != PaymentMethod.ONLINE) {
            throw new IllegalArgumentException("Invalid payment method for this order");
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.razorpayOrderId());
            options.put("razorpay_payment_id", request.razorpayPaymentId());
            options.put("razorpay_signature", request.razorpaySignature());

            boolean verified = Utils.verifyPaymentSignature(options, getRazorpaySecret());
            if (!verified) {
                throw new IllegalArgumentException("Payment verification failed");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Payment verification failed");
        }

        GiftSetCart cart = getRequiredCart(user.getId());
        CartAmounts amounts = validateAndComputeCart(cart);

        if (order.getTotalAmount().compareTo(amounts.finalTotal()) != 0) {
            throw new IllegalArgumentException("Gift set total changed. Please try again.");
        }

        List<GiftSetOrderItem> orderItems = new ArrayList<>();
        for (GiftSetCartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            GiftBox giftBox = cartItem.getGiftBox();

            validateProduct(product);
            validateGiftBox(giftBox);

            if (product.getStock() == null || product.getStock() < 1) {
                throw new IllegalArgumentException("Product is out of stock: " + product.getTitle());
            }
            if (giftBox.getStock() == null || giftBox.getStock() < 1) {
                throw new IllegalArgumentException("Gift box is out of stock: " + giftBox.getName());
            }

            product.setStock(product.getStock() - 1);
            giftBox.setStock(giftBox.getStock() - 1);

            orderItems.add(buildOrderItem(order, cartItem));
        }

        order.getItems().clear();
        order.getItems().addAll(orderItems);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setRazorpayOrderId(request.razorpayOrderId());
        order.setRazorpayPaymentId(request.razorpayPaymentId());
        order.setRazorpaySignature(request.razorpaySignature());

        GiftSetOrder saved = giftSetOrderRepository.save(order);
        cart.getItems().clear();
        giftSetCartRepository.save(cart);

        return new VerifyGiftSetRazorpayPaymentResponse(
                "Payment verified successfully",
                saved.getId(),
                saved.getOrderNumber(),
                saved.getPaymentStatus().name()
        );
    }

    @Transactional(readOnly = true)
    public List<GiftSetOrderResponse> myOrders(Authentication authentication) {
        User user = getRequiredUser(authentication);
        return giftSetOrderRepository.findByUserIdOrderByIdDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GiftSetOrderResponse myOrderById(Authentication authentication, Long id) {
        User user = getRequiredUser(authentication);
        GiftSetOrder order = giftSetOrderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Gift set order not found"));
        return toResponse(order);
    }

    private GiftSetOrder buildBaseOrder(
            User user,
            Address address,
            String couponCode,
            PaymentMethod paymentMethod,
            CartAmounts amounts
    ) {
        GiftSetOrder order = new GiftSetOrder();
        order.setOrderNumber(generateOrderNumber("GFT"));
        order.setUser(user);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setSubtotalAmount(amounts.subtotal());
        order.setShippingAmount(BigDecimal.ZERO);
        order.setDiscountAmount(amounts.discountAmount());
        order.setTotalAmount(amounts.finalTotal());
        order.setCouponCode(blankToNull(couponCode));

        order.setAddressFullName(address.getFullName());
        order.setAddressPhone(address.getPhone());
        order.setAddressLine1(address.getLine1());
        order.setAddressLine2(address.getLine2());
        order.setAddressCity(address.getCity());
        order.setAddressState(address.getState());
        order.setAddressPincode(address.getPincode());
        order.setAddressCountry(address.getCountry());

        return order;
    }

    private GiftSetOrderItem buildOrderItem(GiftSetOrder order, GiftSetCartItem cartItem) {
        BigDecimal productPrice = toMoney(cartItem.getProductPriceSnapshot());
        BigDecimal giftBoxPrice = toMoney(cartItem.getGiftBoxPriceSnapshot());
        BigDecimal lineTotal = productPrice.add(giftBoxPrice);

        GiftSetOrderItem item = new GiftSetOrderItem();
        item.setOrder(order);
        item.setProduct(cartItem.getProduct());
        item.setProductTitle(cartItem.getProduct().getTitle());
        item.setProductImageUrl(extractFirstProductImage(cartItem.getProduct()));
        item.setProductPriceSnapshot(productPrice);
        item.setGiftBox(cartItem.getGiftBox());
        item.setGiftBoxName(cartItem.getGiftBox().getName());
        item.setGiftBoxImageUrl(cartItem.getGiftBox().getImagePath());
        item.setGiftBoxPriceSnapshot(giftBoxPrice);
        item.setLineTotal(lineTotal);
        return item;
    }

    private CartAmounts validateAndComputeCart(GiftSetCart cart) {
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Gift set cart is empty");
        }
        if (cart.getItems().size() > 5) {
            throw new IllegalArgumentException("Maximum 5 items allowed in gift set");
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (GiftSetCartItem item : cart.getItems()) {
            validateProduct(item.getProduct());
            validateGiftBox(item.getGiftBox());

            BigDecimal productPrice = toMoney(item.getProductPriceSnapshot());
            BigDecimal giftBoxPrice = toMoney(item.getGiftBoxPriceSnapshot());
            subtotal = subtotal.add(productPrice).add(giftBoxPrice);
        }

        int totalProducts = cart.getItems().size();
        int discountPercent = totalProducts >= 3 ? 15 : totalProducts == 2 ? 10 : 0;
        BigDecimal discountAmount = subtotal
                .multiply(BigDecimal.valueOf(discountPercent))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal finalTotal = subtotal.subtract(discountAmount);

        return new CartAmounts(subtotal, discountAmount, finalTotal);
    }

    private void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        if (product.getPriceInr() == null) {
            throw new IllegalArgumentException("Selected product price is invalid");
        }
        if (product.getStock() == null || product.getStock() < 1) {
            throw new IllegalArgumentException("Product is out of stock: " + product.getTitle());
        }
    }

    private void validateGiftBox(GiftBox giftBox) {
        if (giftBox == null) {
            throw new IllegalArgumentException("Gift box not found");
        }
        if (giftBox.isDeleted()) {
            throw new IllegalArgumentException("Selected gift box is deleted");
        }
        if (!giftBox.isActive()) {
            throw new IllegalArgumentException("Selected gift box is inactive");
        }
        if (giftBox.getPriceInr() == null) {
            throw new IllegalArgumentException("Selected gift box price is invalid");
        }
    }

    private Address getRequiredAddress(Long userId, Long addressId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
    }

    private GiftSetCart getRequiredCart(Long userId) {
        return giftSetCartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new IllegalArgumentException("Gift set cart is empty"));
    }

    private User getRequiredUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private PaymentMethod parsePaymentMethod(String value) {
        try {
            return PaymentMethod.valueOf(value.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid payment method");
        }
    }

    private String generateOrderNumber(String prefix) {
        return prefix + "-" + OffsetDateTime.now().toEpochSecond() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BigDecimal toMoney(Integer value) {
        return BigDecimal.valueOf(value.longValue()).setScale(2, RoundingMode.HALF_UP);
    }

    private String extractFirstProductImage(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }

        Object image = product.getImages().get(0);
        if (image == null) return null;

        try {
            return (String) image.getClass().getMethod("getImagePath").invoke(image);
        } catch (Exception ignored) {
        }

        try {
            return (String) image.getClass().getMethod("getUrl").invoke(image);
        } catch (Exception ignored) {
        }

        try {
            return (String) image.getClass().getMethod("getImageUrl").invoke(image);
        } catch (Exception ignored) {
        }

        return null;
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private String getRazorpaySecret() {
        return System.getenv("RAZORPAY_KEY_SECRET");
    }

    private GiftSetOrderResponse toResponse(GiftSetOrder order) {
        return new GiftSetOrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus().name(),
                order.getPaymentMethod().name(),
                order.getPaymentStatus().name(),
                order.getSubtotalAmount(),
                order.getShippingAmount(),
                order.getDiscountAmount(),
                order.getTotalAmount(),
                order.getCouponCode(),
                order.getAddressFullName(),
                order.getAddressPhone(),
                order.getAddressLine1(),
                order.getAddressLine2(),
                order.getAddressCity(),
                order.getAddressState(),
                order.getAddressPincode(),
                order.getAddressCountry(),
                order.getCreatedAt(),
                order.getItems().stream().map(item -> new GiftSetOrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProductTitle(),
                        item.getProductImageUrl(),
                        item.getProductPriceSnapshot(),
                        item.getGiftBox().getId(),
                        item.getGiftBoxName(),
                        item.getGiftBoxImageUrl(),
                        item.getGiftBoxPriceSnapshot(),
                        item.getLineTotal()
                )).toList()
        );
    }

    private record CartAmounts(
            BigDecimal subtotal,
            BigDecimal discountAmount,
            BigDecimal finalTotal
    ) {
    }
}