
// package com.mydev.ecommerce.order.service;

// import com.mydev.ecommerce.address.model.Address;
// import com.mydev.ecommerce.address.repository.AddressRepository;
// import com.mydev.ecommerce.cart.model.Cart;
// import com.mydev.ecommerce.cart.model.CartItem;
// import com.mydev.ecommerce.cart.repository.CartRepository;
// import com.mydev.ecommerce.coupon.dto.CouponCalculationResult;
// import com.mydev.ecommerce.coupon.service.CouponService;
// import com.mydev.ecommerce.email.dto.DeliveredEmailPayload;
// import com.mydev.ecommerce.email.dto.OrderEmailPayload;
// import com.mydev.ecommerce.email.dto.ShipmentEmailPayload;
// import com.mydev.ecommerce.email.service.OrderEmailService;
// import com.mydev.ecommerce.order.dto.OrderItemResponse;
// import com.mydev.ecommerce.order.dto.OrderResponse;
// import com.mydev.ecommerce.order.dto.PlaceOrderRequest;
// import com.mydev.ecommerce.order.dto.ShipmentResponse;
// import com.mydev.ecommerce.order.dto.UpdateOrderStatusRequest;
// import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
// import com.mydev.ecommerce.order.event.OrderDeliveredEvent;
// import com.mydev.ecommerce.order.event.ShipmentUpdatedEvent;
// import com.mydev.ecommerce.order.model.Order;
// import com.mydev.ecommerce.order.model.OrderItem;
// import com.mydev.ecommerce.order.model.OrderReviewEmailJob;
// import com.mydev.ecommerce.order.model.OrderStatus;
// import com.mydev.ecommerce.order.model.PaymentMethod;
// import com.mydev.ecommerce.order.model.Shipment;
// import com.mydev.ecommerce.order.repository.OrderRepository;
// import com.mydev.ecommerce.order.repository.OrderReviewEmailJobRepository;
// import com.mydev.ecommerce.order.repository.ShipmentRepository;
// import com.mydev.ecommerce.user.model.User;
// import com.mydev.ecommerce.user.repository.UserRepository;
// import com.mydev.ecommerce.whatsapp.service.WhatsAppService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.ApplicationEventPublisher;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.net.URI;
// import java.time.OffsetDateTime;
// import java.util.List;
// import java.util.Locale;
// import java.util.Objects;
// import java.util.UUID;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// @Transactional
// public class OrderService {

//     private final UserRepository userRepository;

//     private final AddressRepository addressRepository;

//     private final CartRepository cartRepository;

//     private final OrderRepository orderRepository;

//     private final ShipmentRepository shipmentRepository;

//     private final OrderReviewEmailJobRepository orderReviewEmailJobRepository;

//     private final CouponService couponService;

//     private final OrderEmailService orderEmailService;

//     private final WhatsAppService whatsAppService;

//     private final ApplicationEventPublisher eventPublisher;

//     @Value(
//             "${app.shipment.delhivery-tracking-url:"
//                     + "https://www.delhivery.com/tracking}"
//     )
//     private String delhiveryTrackingUrl;

//     @Value("${app.review-email.delay-days:2}")
//     private long reviewEmailDelayDays;

//     public OrderResponse placeOrder(
//             Authentication authentication,
//             PlaceOrderRequest request
//     ) {
//         User user =
//                 getUser(authentication);

//         Address address =
//                 addressRepository
//                         .findByIdAndUserId(
//                                 request.addressId(),
//                                 user.getId()
//                         )
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Address not found"
//                                 )
//                         );

//         Cart cart =
//                 cartRepository
//                         .findByUserId(
//                                 user.getId()
//                         )
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Cart not found"
//                                 )
//                         );

//         if (
//                 cart.getItems() == null
//                         || cart.getItems().isEmpty()
//         ) {
//             throw new RuntimeException(
//                     "Cart is empty"
//             );
//         }

//         PaymentMethod paymentMethod;

//         try {
//             paymentMethod =
//                     PaymentMethod.valueOf(
//                             request.paymentMethod()
//                                     .trim()
//                                     .toUpperCase(
//                                             Locale.ROOT
//                                     )
//                     );

//         } catch (
//                 NullPointerException
//                         | IllegalArgumentException exception
//         ) {
//             throw new RuntimeException(
//                     "Invalid payment method"
//             );
//         }

//         BigDecimal subtotal =
//                 BigDecimal.ZERO;

//         Order order =
//                 new Order();

//         order.setOrderNumber(
//                 generateOrderNumber()
//         );

//         order.setUser(user);

//         order.setPaymentMethod(
//                 paymentMethod
//         );

//         order.setStatus(
//                 OrderStatus.PLACED
//         );

//         setAddress(
//                 order,
//                 address
//         );

//         for (
//                 CartItem cartItem
//                 : cart.getItems()
//         ) {
//             if (
//                     cartItem.getProduct() == null
//             ) {
//                 throw new RuntimeException(
//                         "Cart product not found"
//                 );
//             }

//             if (
//                     cartItem.getProduct().getStock()
//                             < cartItem.getQuantity()
//             ) {
//                 throw new RuntimeException(
//                         "Insufficient stock for product: "
//                                 + cartItem
//                                 .getProduct()
//                                 .getTitle()
//                 );
//             }

//             OrderItem orderItem =
//                     buildOrderItem(
//                             order,
//                             cartItem
//                     );

//             order.getItems()
//                     .add(orderItem);

//             subtotal =
//                     subtotal.add(
//                             orderItem.getLineTotal()
//                     );

//             cartItem
//                     .getProduct()
//                     .setStock(
//                             cartItem
//                                     .getProduct()
//                                     .getStock()
//                                     - cartItem.getQuantity()
//                     );
//         }

//         BigDecimal shipping =
//                 BigDecimal.ZERO;

//         BigDecimal discount =
//                 BigDecimal.ZERO;

//         BigDecimal total =
//                 subtotal;

//         boolean hasCoupon =
//                 request.couponCode() != null
//                         && !request
//                         .couponCode()
//                         .isBlank();

//         CouponCalculationResult couponResult =
//                 null;

//         if (hasCoupon) {
//             couponResult =
//                     couponService
//                             .validateAndCalculate(
//                                     request
//                                             .couponCode()
//                                             .trim(),
//                                     subtotal
//                             );

//             discount =
//                     couponResult
//                             .discountAmount();

//             total =
//                     subtotal.subtract(
//                             discount
//                     );
//         }

//         order.setSubtotalAmount(
//                 subtotal
//         );

//         order.setShippingAmount(
//                 shipping
//         );

//         order.setDiscountAmount(
//                 discount
//         );

//         order.setTotalAmount(
//                 total
//         );

//         order.setCouponCode(
//                 hasCoupon
//                         ? couponResult
//                         .coupon()
//                         .getCode()
//                         : null
//         );

//         Order saved =
//                 orderRepository.save(order);

//         if (hasCoupon) {
//             couponService.consumeCoupon(
//                     couponResult.coupon(),
//                     user,
//                     saved
//             );
//         }

//         cart.getItems().clear();

//         cartRepository.save(cart);

//         try {
//             sendOrderEmails(
//                     user,
//                     saved,
//                     paymentMethod.name()
//             );

//         } catch (Exception exception) {
//             log.error(
//                     "Order email failed -> order={}, reason={}",
//                     saved.getOrderNumber(),
//                     exception.getMessage(),
//                     exception
//             );
//         }

//         try {
//             whatsAppService
//                     .sendOrderPlacedMessage(
//                             saved
//                     );

//         } catch (Exception exception) {
//             log.error(
//                     "WhatsApp message failed -> order={}, reason={}",
//                     saved.getOrderNumber(),
//                     exception.getMessage(),
//                     exception
//             );
//         }

//         return map(saved);
//     }

//     @Transactional(readOnly = true)
//     public List<OrderResponse> adminAllOrders() {
//         return orderRepository
//                 .findAllByOrderByIdDesc()
//                 .stream()
//                 .map(this::map)
//                 .toList();
//     }

//     @Transactional(readOnly = true)
//     public OrderResponse adminOrderByIdentifier(
//             String identifier
//     ) {
//         String value =
//                 requiredValue(
//                         identifier,
//                         "Order identifier"
//                 );

//         Order order;

//         if (value.matches("\\d+")) {
//             Long orderId;

//             try {
//                 orderId =
//                         Long.valueOf(value);

//             } catch (NumberFormatException exception) {
//                 throw new RuntimeException(
//                         "Invalid order ID"
//                 );
//             }

//             order =
//                     orderRepository
//                             .findDetailedById(
//                                     orderId
//                             )
//                             .orElseThrow(() ->
//                                     new RuntimeException(
//                                             "Order not found"
//                                     )
//                             );

//         } else {
//             order =
//                     orderRepository
//                             .findDetailedByOrderNumber(
//                                     value.trim()
//                                             .toUpperCase(Locale.ROOT)
//                             )
//                             .orElseThrow(() ->
//                                     new RuntimeException(
//                                             "Order not found"
//                                     )
//                             );
//         }

//         return map(order);
//     }

//     public OrderResponse adminUpdateStatus(
//             Long orderId,
//             UpdateOrderStatusRequest request
//     ) {
//         Order order =
//                 orderRepository
//                         .findDetailedById(
//                                 orderId
//                         )
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Order not found"
//                                 )
//                         );

//         OrderStatus previousStatus =
//                 order.getStatus();

//         OrderStatus newStatus;

//         try {
//             newStatus =
//                     OrderStatus.valueOf(
//                             request.status()
//                                     .trim()
//                                     .toUpperCase(
//                                             Locale.ROOT
//                                     )
//                     );

//         } catch (
//                 NullPointerException
//                         | IllegalArgumentException exception
//         ) {
//             throw new RuntimeException(
//                     "Invalid order status: "
//                             + request.status()
//             );
//         }

//         boolean reviewJobAlreadyExists =
//                 orderReviewEmailJobRepository
//                         .existsByOrderId(
//                                 orderId
//                         );

//         boolean shouldTriggerDeliveredFlow =
//                 newStatus == OrderStatus.DELIVERED
//                         && previousStatus != OrderStatus.DELIVERED
//                         && !reviewJobAlreadyExists;

//         OffsetDateTime deliveredAt =
//                 OffsetDateTime.now();

//         order.setStatus(newStatus);

//         Order saved =
//                 orderRepository.save(order);

//         if (shouldTriggerDeliveredFlow) {
//             createReviewEmailJob(
//                     saved
//             );

//             DeliveredEmailPayload deliveredEmailPayload =
//                     buildDeliveredEmailPayload(
//                             saved,
//                             deliveredAt
//                     );

//             eventPublisher.publishEvent(
//                     new OrderDeliveredEvent(
//                             deliveredEmailPayload
//                     )
//             );
//         }

//         return map(saved);
//     }

//     public OrderResponse adminUpdateShipment(
//             Long orderId,
//             UpdateShipmentRequest request
//     ) {
//         Order order =
//                 orderRepository
//                         .findDetailedById(
//                                 orderId
//                         )
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Order not found"
//                                 )
//                         );

//         if (
//                 order.getStatus()
//                         == OrderStatus.CANCELLED
//         ) {
//             throw new RuntimeException(
//                     "A cancelled order cannot be shipped"
//             );
//         }

//         String courierName =
//                 requiredValue(
//                         request.courierName(),
//                         "Courier name"
//                 );

//         String trackingId =
//                 requiredValue(
//                         request.trackingId(),
//                         "Tracking ID / AWB"
//                 );

//         String trackingUrl =
//                 resolveTrackingUrl(
//                         courierName,
//                         request.trackingUrl()
//                 );

//         boolean trackingIdExists =
//                 shipmentRepository
//                         .existsByTrackingIdAndOrderIdNot(
//                                 trackingId,
//                                 orderId
//                         );

//         if (trackingIdExists) {
//             throw new RuntimeException(
//                     "This tracking ID is already assigned "
//                             + "to another order"
//             );
//         }

//         Shipment shipment =
//                 order.getShipment();

//         boolean newShipment =
//                 shipment == null;

//         if (newShipment) {
//             shipment =
//                     new Shipment();

//             shipment.setShippedAt(
//                     OffsetDateTime.now()
//             );

//             order.attachShipment(
//                     shipment
//             );
//         }

//         boolean shipmentChanged =
//                 newShipment
//                         || !Objects.equals(
//                         shipment.getCourierName(),
//                         courierName
//                 )
//                         || !Objects.equals(
//                         shipment.getTrackingId(),
//                         trackingId
//                 )
//                         || !Objects.equals(
//                         shipment.getTrackingUrl(),
//                         trackingUrl
//                 );

//         shipment.setCourierName(
//                 courierName
//         );

//         shipment.setTrackingId(
//                 trackingId
//         );

//         shipment.setTrackingUrl(
//                 trackingUrl
//         );

//         if (
//                 order.getStatus()
//                         != OrderStatus.DELIVERED
//         ) {
//             order.setStatus(
//                     OrderStatus.SHIPPED
//             );
//         }

//         Order saved =
//                 orderRepository.save(order);

//         if (shipmentChanged) {
//             ShipmentEmailPayload emailPayload =
//                     buildShipmentEmailPayload(
//                             saved,
//                             shipment
//                     );

//             eventPublisher.publishEvent(
//                     new ShipmentUpdatedEvent(
//                             emailPayload
//                     )
//             );
//         }

//         return map(saved);
//     }

//     @Transactional(readOnly = true)
//     public List<OrderResponse> myOrders(
//             Authentication authentication
//     ) {
//         User user =
//                 getUser(authentication);

//         return orderRepository
//                 .findByUserIdOrderByIdDesc(
//                         user.getId()
//                 )
//                 .stream()
//                 .map(this::map)
//                 .toList();
//     }

//     @Transactional(readOnly = true)
//     public OrderResponse myOrderById(
//             Authentication authentication,
//             Long orderId
//     ) {
//         User user =
//                 getUser(authentication);

//         Order order =
//                 orderRepository
//                         .findByIdAndUserId(
//                                 orderId,
//                                 user.getId()
//                         )
//                         .orElseThrow(() ->
//                                 new RuntimeException(
//                                         "Order not found"
//                                 )
//                         );

//         return map(order);
//     }

//     private void sendOrderEmails(
//             User user,
//             Order order,
//             String paymentType
//     ) {
//         OrderEmailPayload payload =
//                 buildOrderEmailPayload(
//                         user,
//                         order
//                 );

//         if (
//                 "ONLINE".equalsIgnoreCase(
//                         paymentType
//                 )
//                         && order.getPaymentStatus() != null
//                         && "PAID".equalsIgnoreCase(
//                         order
//                                 .getPaymentStatus()
//                                 .name()
//                 )
//         ) {
//             orderEmailService
//                     .sendPaidOrderConfirmedCustomerEmail(
//                             payload
//                     );

//         } else {
//             orderEmailService
//                     .sendCodOrderPlacedCustomerEmail(
//                             payload
//                     );
//         }

//         orderEmailService
//                 .sendOrderAdminNotification(
//                         payload,
//                         "COD".equalsIgnoreCase(
//                                 paymentType
//                         )
//                                 ? "New COD order placed."
//                                 : "New order placed."
//                 );
//     }

//     private OrderEmailPayload buildOrderEmailPayload(
//             User user,
//             Order order
//     ) {
//         return OrderEmailPayload.builder()
//                 .customerName(
//                         user.getName()
//                 )
//                 .customerEmail(
//                         user.getEmail()
//                 )
//                 .orderNumber(
//                         order.getOrderNumber()
//                 )
//                 .orderStatus(
//                         order.getStatus().name()
//                 )
//                 .paymentMethod(
//                         order.getPaymentMethod().name()
//                 )
//                 .paymentStatus(
//                         order.getPaymentStatus() != null
//                                 ? order
//                                 .getPaymentStatus()
//                                 .name()
//                                 : "PENDING"
//                 )
//                 .subtotalAmount(
//                         order.getSubtotalAmount()
//                 )
//                 .shippingAmount(
//                         order.getShippingAmount()
//                 )
//                 .discountAmount(
//                         order.getDiscountAmount()
//                 )
//                 .totalAmount(
//                         order.getTotalAmount()
//                 )
//                 .couponCode(
//                         order.getCouponCode()
//                 )
//                 .addressFullName(
//                         order.getAddressFullName()
//                 )
//                 .addressPhone(
//                         order.getAddressPhone()
//                 )
//                 .addressLine1(
//                         order.getAddressLine1()
//                 )
//                 .addressLine2(
//                         order.getAddressLine2()
//                 )
//                 .addressCity(
//                         order.getAddressCity()
//                 )
//                 .addressState(
//                         order.getAddressState()
//                 )
//                 .addressPincode(
//                         order.getAddressPincode()
//                 )
//                 .addressCountry(
//                         order.getAddressCountry()
//                 )
//                 .createdAt(
//                         order.getCreatedAt()
//                 )
//                 .items(
//                         order.getItems()
//                                 .stream()
//                                 .map(item ->
//                                         OrderEmailPayload
//                                                 .OrderEmailItemPayload
//                                                 .builder()
//                                                 .productTitle(
//                                                         item.getProductTitle()
//                                                 )
//                                                 .quantity(
//                                                         item.getQuantity()
//                                                 )
//                                                 .unitPrice(
//                                                         item.getUnitPrice()
//                                                 )
//                                                 .lineTotal(
//                                                         item.getLineTotal()
//                                                 )
//                                                 .imageUrl(
//                                                         item.getImageUrl()
//                                                 )
//                                                 .build()
//                                 )
//                                 .toList()
//                 )
//                 .build();
//     }

//     private ShipmentEmailPayload buildShipmentEmailPayload(
//             Order order,
//             Shipment shipment
//     ) {
//         return ShipmentEmailPayload.builder()
//                 .orderId(
//                         order.getId()
//                 )
//                 .orderNumber(
//                         order.getOrderNumber()
//                 )
//                 .customerName(
//                         order.getUser().getName()
//                 )
//                 .customerEmail(
//                         order.getUser().getEmail()
//                 )
//                 .totalAmount(
//                         order.getTotalAmount()
//                 )
//                 .courierName(
//                         shipment.getCourierName()
//                 )
//                 .trackingId(
//                         shipment.getTrackingId()
//                 )
//                 .trackingUrl(
//                         shipment.getTrackingUrl()
//                 )
//                 .shippedAt(
//                         shipment.getShippedAt()
//                 )
//                 .build();
//     }

//     private void createReviewEmailJob(
//             Order order
//     ) {
//         OrderReviewEmailJob job =
//                 new OrderReviewEmailJob();

//         job.setOrder(order);

//         job.setScheduledAt(
//                 OffsetDateTime
//                         .now()
//                         .plusDays(
//                                 reviewEmailDelayDays
//                         )
//         );

//         orderReviewEmailJobRepository.save(job);
//     }

//     private DeliveredEmailPayload buildDeliveredEmailPayload(
//             Order order,
//             OffsetDateTime deliveredAt
//     ) {
//         return DeliveredEmailPayload
//                 .builder()
//                 .orderId(
//                         order.getId()
//                 )
//                 .orderNumber(
//                         order.getOrderNumber()
//                 )
//                 .customerName(
//                         order.getUser().getName()
//                 )
//                 .customerEmail(
//                         order.getUser().getEmail()
//                 )
//                 .totalAmount(
//                         order.getTotalAmount()
//                 )
//                 .deliveredAt(
//                         deliveredAt
//                 )
//                 .items(
//                         order.getItems()
//                                 .stream()
//                                 .map(item ->
//                                         DeliveredEmailPayload
//                                                 .DeliveredEmailItemPayload
//                                                 .builder()
//                                                 .productId(
//                                                         item.getProduct() != null
//                                                                 ? item
//                                                                 .getProduct()
//                                                                 .getId()
//                                                                 : null
//                                                 )
//                                                 .productTitle(
//                                                         item.getProductTitle()
//                                                 )
//                                                 .imageUrl(
//                                                         item.getImageUrl()
//                                                 )
//                                                 .quantity(
//                                                         item.getQuantity()
//                                                 )
//                                                 .build()
//                                 )
//                                 .toList()
//                 )
//                 .build();
//     }

//     private void setAddress(
//             Order order,
//             Address address
//     ) {
//         order.setAddressFullName(
//                 address.getFullName()
//         );

//         order.setAddressPhone(
//                 address.getPhone()
//         );

//         order.setAddressLine1(
//                 address.getLine1()
//         );

//         order.setAddressLine2(
//                 address.getLine2()
//         );

//         order.setAddressCity(
//                 address.getCity()
//         );

//         order.setAddressState(
//                 address.getState()
//         );

//         order.setAddressPincode(
//                 address.getPincode()
//         );

//         order.setAddressCountry(
//                 address.getCountry()
//         );
//     }

//     private OrderItem buildOrderItem(
//             Order order,
//             CartItem cartItem
//     ) {
//         OrderItem item =
//                 new OrderItem();

//         item.setOrder(order);

//         item.setProduct(
//                 cartItem.getProduct()
//         );

//         item.setProductTitle(
//                 cartItem
//                         .getProduct()
//                         .getTitle()
//         );

//         item.setQuantity(
//                 cartItem.getQuantity()
//         );

//         BigDecimal unitPrice =
//                 cartItem
//                         .getUnitPriceSnapshot();

//         if (unitPrice == null) {
//             throw new RuntimeException(
//                     "Product price is missing for: "
//                             + cartItem
//                             .getProduct()
//                             .getTitle()
//             );
//         }

//         BigDecimal lineTotal =
//                 unitPrice.multiply(
//                         BigDecimal.valueOf(
//                                 cartItem.getQuantity()
//                         )
//                 );

//         item.setUnitPrice(
//                 unitPrice
//         );

//         item.setLineTotal(
//                 lineTotal
//         );

//         if (
//                 cartItem
//                         .getProduct()
//                         .getImages() != null
//                         && !cartItem
//                         .getProduct()
//                         .getImages()
//                         .isEmpty()
//         ) {
//             item.setImageUrl(
//                     cartItem
//                             .getProduct()
//                             .getImages()
//                             .get(0)
//                             .getImageUrl()
//             );
//         }

//         return item;
//     }

//     private User getUser(
//             Authentication authentication
//     ) {
//         if (
//                 authentication == null
//                         || authentication.getName() == null
//                         || authentication
//                         .getName()
//                         .isBlank()
//         ) {
//             throw new RuntimeException(
//                     "Authentication is required"
//             );
//         }

//         return userRepository
//                 .findByEmail(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException(
//                                 "User not found"
//                         )
//                 );
//     }

//     private String generateOrderNumber() {
//         return "TF-"
//                 + UUID.randomUUID()
//                 .toString()
//                 .replace("-", "")
//                 .substring(0, 10)
//                 .toUpperCase(
//                         Locale.ROOT
//                 );
//     }

//     private String requiredValue(
//             String value,
//             String fieldName
//     ) {
//         if (
//                 value == null
//                         || value.isBlank()
//         ) {
//             throw new RuntimeException(
//                     fieldName + " is required"
//             );
//         }

//         return value.trim();
//     }

//     private String resolveTrackingUrl(
//             String courierName,
//             String providedTrackingUrl
//     ) {
//         if (
//                 providedTrackingUrl != null
//                         && !providedTrackingUrl.isBlank()
//         ) {
//             String trackingUrl =
//                     providedTrackingUrl.trim();

//             validateHttpUrl(
//                     trackingUrl
//             );

//             return trackingUrl;
//         }

//         if (
//                 "DELHIVERY".equalsIgnoreCase(
//                         courierName
//                 )
//         ) {
//             String trackingUrl =
//                     delhiveryTrackingUrl.trim();

//             validateHttpUrl(
//                     trackingUrl
//             );

//             return trackingUrl;
//         }

//         return null;
//     }

//     private void validateHttpUrl(
//             String value
//     ) {
//         try {
//             URI uri =
//                     URI.create(value);

//             String scheme =
//                     uri.getScheme();

//             if (
//                     scheme == null
//                             || (
//                             !"http".equalsIgnoreCase(
//                                     scheme
//                             )
//                                     && !"https".equalsIgnoreCase(
//                                     scheme
//                             )
//                     )
//             ) {
//                 throw new RuntimeException(
//                         "Tracking URL must start with "
//                                 + "http:// or https://"
//                 );
//             }

//         } catch (IllegalArgumentException exception) {
//             throw new RuntimeException(
//                     "Tracking URL is invalid"
//             );
//         }
//     }

//     private OrderResponse map(
//             Order order
//     ) {
//         List<OrderItemResponse> items =
//                 order.getItems()
//                         .stream()
//                         .map(item ->
//                                 new OrderItemResponse(
//                                         item.getId(),
//                                         item.getProduct() != null
//                                                 ? item
//                                                 .getProduct()
//                                                 .getId()
//                                                 : null,
//                                         item.getProductTitle(),
//                                         item.getImageUrl(),
//                                         item.getQuantity(),
//                                         item.getUnitPrice(),
//                                         item.getLineTotal()
//                                 )
//                         )
//                         .toList();

//         return new OrderResponse(
//                 order.getId(),
//                 order.getOrderNumber(),
//                 order.getStatus().name(),
//                 order.getPaymentMethod().name(),
//                 order.getPaymentStatus() != null
//                         ? order
//                         .getPaymentStatus()
//                         .name()
//                         : "PENDING",
//                 order.getSubtotalAmount(),
//                 order.getShippingAmount(),
//                 order.getDiscountAmount(),
//                 order.getTotalAmount(),
//                 order.getCouponCode(),
//                 order.getAddressFullName(),
//                 order.getAddressPhone(),
//                 order.getAddressLine1(),
//                 order.getAddressLine2(),
//                 order.getAddressCity(),
//                 order.getAddressState(),
//                 order.getAddressPincode(),
//                 order.getAddressCountry(),
//                 order.getCreatedAt(),
//                 items,
//                 mapShipment(
//                         order.getShipment()
//                 )
//         );
//     }

//     private ShipmentResponse mapShipment(
//             Shipment shipment
//     ) {
//         if (shipment == null) {
//             return null;
//         }

//         return new ShipmentResponse(
//                 shipment.getId(),
//                 shipment.getCourierName(),
//                 shipment.getTrackingId(),
//                 shipment.getTrackingUrl(),
//                 shipment.getShippedAt(),
//                 shipment.getUpdatedAt()
//         );
//     }
// }















package com.mydev.ecommerce.order.service;

import com.mydev.ecommerce.address.model.Address;
import com.mydev.ecommerce.address.repository.AddressRepository;
import com.mydev.ecommerce.cart.model.Cart;
import com.mydev.ecommerce.cart.model.CartItem;
import com.mydev.ecommerce.cart.repository.CartRepository;
import com.mydev.ecommerce.coupon.dto.CouponCalculationResult;
import com.mydev.ecommerce.coupon.service.CouponService;
import com.mydev.ecommerce.email.dto.DeliveredEmailPayload;
import com.mydev.ecommerce.email.dto.OrderEmailPayload;
import com.mydev.ecommerce.email.dto.ShipmentEmailPayload;
import com.mydev.ecommerce.email.service.OrderEmailService;
import com.mydev.ecommerce.order.dto.OrderItemResponse;
import com.mydev.ecommerce.order.dto.OrderResponse;
import com.mydev.ecommerce.order.dto.PlaceOrderRequest;
import com.mydev.ecommerce.order.dto.ShipmentResponse;
import com.mydev.ecommerce.order.dto.UpdateOrderStatusRequest;
import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
import com.mydev.ecommerce.order.event.OrderDeliveredEvent;
import com.mydev.ecommerce.order.event.ShipmentUpdatedEvent;
import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.order.model.OrderItem;
import com.mydev.ecommerce.order.model.OrderReviewEmailJob;
import com.mydev.ecommerce.order.model.OrderStatus;
import com.mydev.ecommerce.order.model.PaymentMethod;
import com.mydev.ecommerce.order.model.Shipment;
import com.mydev.ecommerce.order.repository.OrderRepository;
import com.mydev.ecommerce.order.repository.OrderReviewEmailJobRepository;
import com.mydev.ecommerce.order.repository.ShipmentRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import com.mydev.ecommerce.whatsapp.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final UserRepository userRepository;

    private final AddressRepository addressRepository;

    private final CartRepository cartRepository;

    private final OrderRepository orderRepository;

    private final ShipmentRepository shipmentRepository;

    private final OrderReviewEmailJobRepository orderReviewEmailJobRepository;

    private final CouponService couponService;

    private final OrderEmailService orderEmailService;

    private final WhatsAppService whatsAppService;

    private final ApplicationEventPublisher eventPublisher;

    @Value(
            "${app.shipment.delhivery-tracking-url:"
                    + "https://www.delhivery.com/tracking}"
    )
    private String delhiveryTrackingUrl;

    @Value("${app.review-email.delay-days:2}")
    private long reviewEmailDelayDays;

    public OrderResponse placeOrder(
            Authentication authentication,
            PlaceOrderRequest request
    ) {
        User user =
                getUser(authentication);

        Address address =
                addressRepository
                        .findByIdAndUserId(
                                request.addressId(),
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Address not found"
                                )
                        );

        Cart cart =
                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart not found"
                                )
                        );

        if (
                cart.getItems() == null
                        || cart.getItems().isEmpty()
        ) {
            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        PaymentMethod paymentMethod;

        try {
            paymentMethod =
                    PaymentMethod.valueOf(
                            request.paymentMethod()
                                    .trim()
                                    .toUpperCase(
                                            Locale.ROOT
                                    )
                    );

        } catch (
                NullPointerException
                        | IllegalArgumentException exception
        ) {
            throw new RuntimeException(
                    "Invalid payment method"
            );
        }

        BigDecimal subtotal =
                BigDecimal.ZERO;

        Order order =
                new Order();

        order.setOrderNumber(
                generateOrderNumber()
        );

        order.setUser(user);

        order.setPaymentMethod(
                paymentMethod
        );

        order.setStatus(
                OrderStatus.PLACED
        );

        setAddress(
                order,
                address
        );

        for (
                CartItem cartItem
                : cart.getItems()
        ) {
            if (
                    cartItem.getProduct() == null
            ) {
                throw new RuntimeException(
                        "Cart product not found"
                );
            }

            if (
                    cartItem.getProduct().getStock()
                            < cartItem.getQuantity()
            ) {
                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + cartItem
                                .getProduct()
                                .getTitle()
                );
            }

            OrderItem orderItem =
                    buildOrderItem(
                            order,
                            cartItem
                    );

            order.getItems()
                    .add(orderItem);

            subtotal =
                    subtotal.add(
                            orderItem.getLineTotal()
                    );

            cartItem
                    .getProduct()
                    .setStock(
                            cartItem
                                    .getProduct()
                                    .getStock()
                                    - cartItem.getQuantity()
                    );
        }

        BigDecimal shipping =
                BigDecimal.ZERO;

        BigDecimal discount =
                BigDecimal.ZERO;

        BigDecimal total =
                subtotal;

        boolean hasCoupon =
                request.couponCode() != null
                        && !request
                        .couponCode()
                        .isBlank();

        CouponCalculationResult couponResult =
                null;

        if (hasCoupon) {
            couponResult =
                    couponService
                            .validateAndCalculate(
                                    request
                                            .couponCode()
                                            .trim(),
                                    subtotal
                            );

            discount =
                    couponResult
                            .discountAmount();

            total =
                    subtotal.subtract(
                            discount
                    );
        }

        order.setSubtotalAmount(
                subtotal
        );

        order.setShippingAmount(
                shipping
        );

        order.setDiscountAmount(
                discount
        );

        order.setTotalAmount(
                total
        );

        order.setCouponCode(
                hasCoupon
                        ? couponResult
                        .coupon()
                        .getCode()
                        : null
        );

        Order saved =
                orderRepository.save(order);

        if (hasCoupon) {
            couponService.consumeCoupon(
                    couponResult.coupon(),
                    user,
                    saved
            );
        }

        cart.getItems().clear();

        cartRepository.save(cart);

        try {
            sendOrderEmails(
                    user,
                    saved,
                    paymentMethod.name()
            );

        } catch (Exception exception) {
            log.error(
                    "Order email failed -> order={}, reason={}",
                    saved.getOrderNumber(),
                    exception.getMessage(),
                    exception
            );
        }

        try {
            whatsAppService
                    .sendOrderPlacedMessage(
                            saved
                    );

        } catch (Exception exception) {
            log.error(
                    "WhatsApp message failed -> order={}, reason={}",
                    saved.getOrderNumber(),
                    exception.getMessage(),
                    exception
            );
        }

        return map(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> adminAllOrders() {
        return orderRepository
                .findAllByOrderByIdDesc()
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse adminOrderByIdentifier(
            String identifier
    ) {
        String value =
                requiredValue(
                        identifier,
                        "Order identifier"
                );

        Order order;

        if (value.matches("\\d+")) {
            Long orderId;

            try {
                orderId =
                        Long.valueOf(value);

            } catch (NumberFormatException exception) {
                throw new RuntimeException(
                        "Invalid order ID"
                );
            }

            order =
                    orderRepository
                            .findDetailedById(
                                    orderId
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"
                                    )
                            );

        } else {
            order =
                    orderRepository
                            .findDetailedByOrderNumber(
                                    value.trim()
                                            .toUpperCase(Locale.ROOT)
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"
                                    )
                            );
        }

        return map(order);
    }

    public OrderResponse adminUpdateStatus(
            Long orderId,
            UpdateOrderStatusRequest request
    ) {
        OrderStatus newStatus;

        try {
            newStatus =
                    OrderStatus.valueOf(
                            request.status()
                                    .trim()
                                    .toUpperCase(
                                            Locale.ROOT
                                    )
                    );

        } catch (
                NullPointerException
                        | IllegalArgumentException exception
        ) {
            throw new RuntimeException(
                    "Invalid order status: "
                            + request.status()
            );
        }

        return updateStatusAndTriggerEvents(
                orderId,
                newStatus
        );
    }

    public OrderResponse updateStatusFromSystem(
            Long orderId,
            OrderStatus newStatus
    ) {
        if (newStatus == null) {
            throw new RuntimeException(
                    "Order status is required"
            );
        }

        return updateStatusAndTriggerEvents(
                orderId,
                newStatus
        );
    }

    private OrderResponse updateStatusAndTriggerEvents(
            Long orderId,
            OrderStatus newStatus
    ) {
        Order order =
                orderRepository
                        .findDetailedById(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        OrderStatus previousStatus =
                order.getStatus();

        boolean reviewJobAlreadyExists =
                orderReviewEmailJobRepository
                        .existsByOrderId(
                                orderId
                        );

        boolean shouldTriggerDeliveredFlow =
                newStatus == OrderStatus.DELIVERED
                        && previousStatus != OrderStatus.DELIVERED
                        && !reviewJobAlreadyExists;

        OffsetDateTime deliveredAt =
                OffsetDateTime.now();

        order.setStatus(newStatus);

        Order saved =
                orderRepository.save(order);

        if (shouldTriggerDeliveredFlow) {
            createReviewEmailJob(
                    saved
            );

            DeliveredEmailPayload deliveredEmailPayload =
                    buildDeliveredEmailPayload(
                            saved,
                            deliveredAt
                    );

            eventPublisher.publishEvent(
                    new OrderDeliveredEvent(
                            deliveredEmailPayload
                    )
            );
        }

        return map(saved);
    }

    public OrderResponse adminUpdateShipment(
            Long orderId,
            UpdateShipmentRequest request
    ) {
        Order order =
                orderRepository
                        .findDetailedById(
                                orderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        if (
                order.getStatus()
                        == OrderStatus.CANCELLED
        ) {
            throw new RuntimeException(
                    "A cancelled order cannot be shipped"
            );
        }

        String courierName =
                requiredValue(
                        request.courierName(),
                        "Courier name"
                );

        String trackingId =
                requiredValue(
                        request.trackingId(),
                        "Tracking ID / AWB"
                );

        String trackingUrl =
                resolveTrackingUrl(
                        courierName,
                        request.trackingUrl()
                );

        boolean trackingIdExists =
                shipmentRepository
                        .existsByTrackingIdAndOrderIdNot(
                                trackingId,
                                orderId
                        );

        if (trackingIdExists) {
            throw new RuntimeException(
                    "This tracking ID is already assigned "
                            + "to another order"
            );
        }

        Shipment shipment =
                order.getShipment();

        boolean newShipment =
                shipment == null;

        if (newShipment) {
            shipment =
                    new Shipment();

            shipment.setShippedAt(
                    OffsetDateTime.now()
            );

            order.attachShipment(
                    shipment
            );
        }

        boolean shipmentChanged =
                newShipment
                        || !Objects.equals(
                        shipment.getCourierName(),
                        courierName
                )
                        || !Objects.equals(
                        shipment.getTrackingId(),
                        trackingId
                )
                        || !Objects.equals(
                        shipment.getTrackingUrl(),
                        trackingUrl
                );

        shipment.setCourierName(
                courierName
        );

        shipment.setTrackingId(
                trackingId
        );

        shipment.setTrackingUrl(
                trackingUrl
        );

        if (
                order.getStatus()
                        != OrderStatus.DELIVERED
        ) {
            order.setStatus(
                    OrderStatus.SHIPPED
            );
        }

        Order saved =
                orderRepository.save(order);

        if (shipmentChanged) {
            ShipmentEmailPayload emailPayload =
                    buildShipmentEmailPayload(
                            saved,
                            shipment
                    );

            eventPublisher.publishEvent(
                    new ShipmentUpdatedEvent(
                            emailPayload
                    )
            );
        }

        return map(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders(
            Authentication authentication
    ) {
        User user =
                getUser(authentication);

        return orderRepository
                .findByUserIdOrderByIdDesc(
                        user.getId()
                )
                .stream()
                .map(this::map)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse myOrderById(
            Authentication authentication,
            Long orderId
    ) {
        User user =
                getUser(authentication);

        Order order =
                orderRepository
                        .findByIdAndUserId(
                                orderId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        return map(order);
    }

    private void sendOrderEmails(
            User user,
            Order order,
            String paymentType
    ) {
        OrderEmailPayload payload =
                buildOrderEmailPayload(
                        user,
                        order
                );

        if (
                "ONLINE".equalsIgnoreCase(
                        paymentType
                )
                        && order.getPaymentStatus() != null
                        && "PAID".equalsIgnoreCase(
                        order
                                .getPaymentStatus()
                                .name()
                )
        ) {
            orderEmailService
                    .sendPaidOrderConfirmedCustomerEmail(
                            payload
                    );

        } else {
            orderEmailService
                    .sendCodOrderPlacedCustomerEmail(
                            payload
                    );
        }

        orderEmailService
                .sendOrderAdminNotification(
                        payload,
                        "COD".equalsIgnoreCase(
                                paymentType
                        )
                                ? "New COD order placed."
                                : "New order placed."
                );
    }

    private OrderEmailPayload buildOrderEmailPayload(
            User user,
            Order order
    ) {
        return OrderEmailPayload.builder()
                .customerName(
                        user.getName()
                )
                .customerEmail(
                        user.getEmail()
                )
                .orderNumber(
                        order.getOrderNumber()
                )
                .orderStatus(
                        order.getStatus().name()
                )
                .paymentMethod(
                        order.getPaymentMethod().name()
                )
                .paymentStatus(
                        order.getPaymentStatus() != null
                                ? order
                                .getPaymentStatus()
                                .name()
                                : "PENDING"
                )
                .subtotalAmount(
                        order.getSubtotalAmount()
                )
                .shippingAmount(
                        order.getShippingAmount()
                )
                .discountAmount(
                        order.getDiscountAmount()
                )
                .totalAmount(
                        order.getTotalAmount()
                )
                .couponCode(
                        order.getCouponCode()
                )
                .addressFullName(
                        order.getAddressFullName()
                )
                .addressPhone(
                        order.getAddressPhone()
                )
                .addressLine1(
                        order.getAddressLine1()
                )
                .addressLine2(
                        order.getAddressLine2()
                )
                .addressCity(
                        order.getAddressCity()
                )
                .addressState(
                        order.getAddressState()
                )
                .addressPincode(
                        order.getAddressPincode()
                )
                .addressCountry(
                        order.getAddressCountry()
                )
                .createdAt(
                        order.getCreatedAt()
                )
                .items(
                        order.getItems()
                                .stream()
                                .map(item ->
                                        OrderEmailPayload
                                                .OrderEmailItemPayload
                                                .builder()
                                                .productTitle(
                                                        item.getProductTitle()
                                                )
                                                .quantity(
                                                        item.getQuantity()
                                                )
                                                .unitPrice(
                                                        item.getUnitPrice()
                                                )
                                                .lineTotal(
                                                        item.getLineTotal()
                                                )
                                                .imageUrl(
                                                        item.getImageUrl()
                                                )
                                                .build()
                                )
                                .toList()
                )
                .build();
    }

    private ShipmentEmailPayload buildShipmentEmailPayload(
            Order order,
            Shipment shipment
    ) {
        return ShipmentEmailPayload.builder()
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
                .totalAmount(
                        order.getTotalAmount()
                )
                .courierName(
                        shipment.getCourierName()
                )
                .trackingId(
                        shipment.getTrackingId()
                )
                .trackingUrl(
                        shipment.getTrackingUrl()
                )
                .shippedAt(
                        shipment.getShippedAt()
                )
                .build();
    }

    private void createReviewEmailJob(
            Order order
    ) {
        OrderReviewEmailJob job =
                new OrderReviewEmailJob();

        job.setOrder(order);

        job.setScheduledAt(
                OffsetDateTime
                        .now()
                        .plusDays(
                                reviewEmailDelayDays
                        )
        );

        orderReviewEmailJobRepository.save(job);
    }

    private DeliveredEmailPayload buildDeliveredEmailPayload(
            Order order,
            OffsetDateTime deliveredAt
    ) {
        return DeliveredEmailPayload
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
                .totalAmount(
                        order.getTotalAmount()
                )
                .deliveredAt(
                        deliveredAt
                )
                .items(
                        order.getItems()
                                .stream()
                                .map(item ->
                                        DeliveredEmailPayload
                                                .DeliveredEmailItemPayload
                                                .builder()
                                                .productId(
                                                        item.getProduct() != null
                                                                ? item
                                                                .getProduct()
                                                                .getId()
                                                                : null
                                                )
                                                .productTitle(
                                                        item.getProductTitle()
                                                )
                                                .imageUrl(
                                                        item.getImageUrl()
                                                )
                                                .quantity(
                                                        item.getQuantity()
                                                )
                                                .build()
                                )
                                .toList()
                )
                .build();
    }

    private void setAddress(
            Order order,
            Address address
    ) {
        order.setAddressFullName(
                address.getFullName()
        );

        order.setAddressPhone(
                address.getPhone()
        );

        order.setAddressLine1(
                address.getLine1()
        );

        order.setAddressLine2(
                address.getLine2()
        );

        order.setAddressCity(
                address.getCity()
        );

        order.setAddressState(
                address.getState()
        );

        order.setAddressPincode(
                address.getPincode()
        );

        order.setAddressCountry(
                address.getCountry()
        );
    }

    private OrderItem buildOrderItem(
            Order order,
            CartItem cartItem
    ) {
        OrderItem item =
                new OrderItem();

        item.setOrder(order);

        item.setProduct(
                cartItem.getProduct()
        );

        item.setProductTitle(
                cartItem
                        .getProduct()
                        .getTitle()
        );

        item.setQuantity(
                cartItem.getQuantity()
        );

        BigDecimal unitPrice =
                cartItem
                        .getUnitPriceSnapshot();

        if (unitPrice == null) {
            throw new RuntimeException(
                    "Product price is missing for: "
                            + cartItem
                            .getProduct()
                            .getTitle()
            );
        }

        BigDecimal lineTotal =
                unitPrice.multiply(
                        BigDecimal.valueOf(
                                cartItem.getQuantity()
                        )
                );

        item.setUnitPrice(
                unitPrice
        );

        item.setLineTotal(
                lineTotal
        );

        if (
                cartItem
                        .getProduct()
                        .getImages() != null
                        && !cartItem
                        .getProduct()
                        .getImages()
                        .isEmpty()
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

    private User getUser(
            Authentication authentication
    ) {
        if (
                authentication == null
                        || authentication.getName() == null
                        || authentication
                        .getName()
                        .isBlank()
        ) {
            throw new RuntimeException(
                    "Authentication is required"
            );
        }

        return userRepository
                .findByEmail(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }

    private String generateOrderNumber() {
        return "TF-"
                + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10)
                .toUpperCase(
                        Locale.ROOT
                );
    }

    private String requiredValue(
            String value,
            String fieldName
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            throw new RuntimeException(
                    fieldName + " is required"
            );
        }

        return value.trim();
    }

    private String resolveTrackingUrl(
            String courierName,
            String providedTrackingUrl
    ) {
        if (
                providedTrackingUrl != null
                        && !providedTrackingUrl.isBlank()
        ) {
            String trackingUrl =
                    providedTrackingUrl.trim();

            validateHttpUrl(
                    trackingUrl
            );

            return trackingUrl;
        }

        if (
                "DELHIVERY".equalsIgnoreCase(
                        courierName
                )
        ) {
            String trackingUrl =
                    delhiveryTrackingUrl.trim();

            validateHttpUrl(
                    trackingUrl
            );

            return trackingUrl;
        }

        return null;
    }

    private void validateHttpUrl(
            String value
    ) {
        try {
            URI uri =
                    URI.create(value);

            String scheme =
                    uri.getScheme();

            if (
                    scheme == null
                            || (
                            !"http".equalsIgnoreCase(
                                    scheme
                            )
                                    && !"https".equalsIgnoreCase(
                                    scheme
                            )
                    )
            ) {
                throw new RuntimeException(
                        "Tracking URL must start with "
                                + "http:// or https://"
                );
            }

        } catch (IllegalArgumentException exception) {
            throw new RuntimeException(
                    "Tracking URL is invalid"
            );
        }
    }

    private OrderResponse map(
            Order order
    ) {
        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getId(),
                                        item.getProduct() != null
                                                ? item
                                                .getProduct()
                                                .getId()
                                                : null,
                                        item.getProductTitle(),
                                        item.getImageUrl(),
                                        item.getQuantity(),
                                        item.getUnitPrice(),
                                        item.getLineTotal()
                                )
                        )
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus().name(),
                order.getPaymentMethod().name(),
                order.getPaymentStatus() != null
                        ? order
                        .getPaymentStatus()
                        .name()
                        : "PENDING",
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
                items,
                mapShipment(
                        order.getShipment()
                )
        );
    }

    private ShipmentResponse mapShipment(
            Shipment shipment
    ) {
        if (shipment == null) {
            return null;
        }

        return new ShipmentResponse(
                shipment.getId(),
                shipment.getCourierName(),
                shipment.getTrackingId(),
                shipment.getTrackingUrl(),
                shipment.getShippedAt(),
                shipment.getUpdatedAt()
        );
    }
}