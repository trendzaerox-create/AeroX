
package com.mydev.ecommerce.giftset.repository;

import com.mydev.ecommerce.giftset.model.GiftSetCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GiftSetCartItemRepository extends JpaRepository<GiftSetCartItem, Long> {

    Optional<GiftSetCartItem> findByCartIdAndProductId(Long cartId, Long productId);

    long countByCartId(Long cartId);

    long countByCartIdAndGiftBoxId(Long cartId, Long giftBoxId);
}