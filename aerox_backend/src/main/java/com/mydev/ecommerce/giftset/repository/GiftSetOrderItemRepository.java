package com.mydev.ecommerce.giftset.repository;

import com.mydev.ecommerce.giftset.model.GiftSetOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiftSetOrderItemRepository extends JpaRepository<GiftSetOrderItem, Long> {
}