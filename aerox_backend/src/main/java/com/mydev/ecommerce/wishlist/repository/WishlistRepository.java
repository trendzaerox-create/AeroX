package com.mydev.ecommerce.wishlist.repository;

import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.wishlist.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    @Query("""
        SELECT DISTINCT w
        FROM Wishlist w
        JOIN FETCH w.product p
        LEFT JOIN FETCH p.images
        LEFT JOIN FETCH p.reviews
        WHERE w.user.id = :userId
        ORDER BY w.id DESC
    """)
    List<Wishlist> findByUserIdWithProduct(Long userId);

    Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}