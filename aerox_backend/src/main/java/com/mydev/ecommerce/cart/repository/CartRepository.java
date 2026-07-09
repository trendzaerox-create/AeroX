

package com.mydev.ecommerce.cart.repository;

import com.mydev.ecommerce.cart.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);

    @Query("""
        SELECT DISTINCT c
        FROM Cart c
        LEFT JOIN FETCH c.items i
        LEFT JOIN FETCH i.product p
        WHERE c.user.id = :userId
    """)
    Optional<Cart> findByUserIdWithItems(Long userId);
}