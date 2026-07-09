package com.mydev.ecommerce.order.repository;

import com.mydev.ecommerce.order.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}