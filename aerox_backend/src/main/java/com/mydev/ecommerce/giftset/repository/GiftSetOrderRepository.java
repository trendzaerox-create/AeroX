package com.mydev.ecommerce.giftset.repository;

import com.mydev.ecommerce.giftset.model.GiftSetOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiftSetOrderRepository extends JpaRepository<GiftSetOrder, Long> {

    @EntityGraph(attributePaths = {"items", "items.product", "items.giftBox"})
    List<GiftSetOrder> findByUserIdOrderByIdDesc(Long userId);

    @EntityGraph(attributePaths = {"items", "items.product", "items.giftBox"})
    Optional<GiftSetOrder> findByIdAndUserId(Long id, Long userId);
}