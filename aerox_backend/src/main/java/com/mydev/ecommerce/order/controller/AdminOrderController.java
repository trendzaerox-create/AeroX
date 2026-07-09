
// package com.mydev.ecommerce.order.controller;

// import com.mydev.ecommerce.order.dto.OrderResponse;
// import com.mydev.ecommerce.order.dto.UpdateOrderStatusRequest;
// import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
// import com.mydev.ecommerce.order.service.OrderService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/admin/orders")
// @RequiredArgsConstructor
// public class AdminOrderController {

//     private final OrderService orderService;

//     @GetMapping
//     public List<OrderResponse> allOrders() {
//         return orderService.adminAllOrders();
//     }

//     @PutMapping("/{id}/status")
//     public OrderResponse updateStatus(
//             @PathVariable Long id,
//             @Valid
//             @RequestBody UpdateOrderStatusRequest request
//     ) {
//         return orderService.adminUpdateStatus(
//                 id,
//                 request
//         );
//     }

//     @PutMapping("/{id}/shipment")
//     public OrderResponse updateShipment(
//             @PathVariable Long id,
//             @Valid
//             @RequestBody UpdateShipmentRequest request
//     ) {
//         return orderService.adminUpdateShipment(
//                 id,
//                 request
//         );
//     }
// }

















package com.mydev.ecommerce.order.controller;

import com.mydev.ecommerce.order.dto.OrderResponse;
import com.mydev.ecommerce.order.dto.UpdateOrderStatusRequest;
import com.mydev.ecommerce.order.dto.UpdateShipmentRequest;
import com.mydev.ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> allOrders() {
        return orderService.adminAllOrders();
    }

    // ✅ NEW: supports both:
    // /api/admin/orders/4
    // /api/admin/orders/TF-BCC09946D1
    @GetMapping("/{identifier}")
    public OrderResponse getAdminOrder(
            @PathVariable String identifier
    ) {
        return orderService.adminOrderByIdentifier(identifier);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return orderService.adminUpdateStatus(id, request);
    }

    @PutMapping("/{id}/shipment")
    public OrderResponse updateShipment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShipmentRequest request
    ) {
        return orderService.adminUpdateShipment(id, request);
    }
}