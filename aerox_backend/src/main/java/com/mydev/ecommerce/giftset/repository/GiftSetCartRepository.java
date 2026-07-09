package com.mydev.ecommerce.giftset.repository;

import com.mydev.ecommerce.giftset.model.GiftSetCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface GiftSetCartRepository extends JpaRepository<GiftSetCart, Long> {

    Optional<GiftSetCart> findByUserId(Long userId);

    @Query("""
        select distinct c
        from GiftSetCart c
        left join fetch c.items i
        left join fetch i.product
        left join fetch i.giftBox
        where c.user.id = :userId
    """)
    Optional<GiftSetCart> findByUserIdWithItems(Long userId);
}