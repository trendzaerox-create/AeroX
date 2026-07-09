
package com.mydev.ecommerce.order.controller;

import com.mydev.ecommerce.order.dto.OrderResponse;
import com.mydev.ecommerce.order.dto.PlaceOrderRequest;
import com.mydev.ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request
    ) {
        return orderService.placeOrder(authentication, request);
    }

    @GetMapping
    public List<OrderResponse> myOrders(Authentication authentication) {
        return orderService.myOrders(authentication);
    }

    @GetMapping("/{id}")
    public OrderResponse myOrderById(Authentication authentication, @PathVariable Long id) {
        return orderService.myOrderById(authentication, id);
    }
}