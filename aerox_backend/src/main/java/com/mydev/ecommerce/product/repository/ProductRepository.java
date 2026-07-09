
package com.mydev.ecommerce.product.repository;

import com.mydev.ecommerce.product.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p.id
        FROM Product p
        WHERE p.active = true
          AND p.deleted = false
        ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Long> findActiveProductIds(Pageable pageable);

    @Query("""
        SELECT p.id
        FROM Product p
        WHERE p.category.id = :categoryId
          AND p.active = true
          AND p.deleted = false
        ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Long> findActiveProductIdsByCategoryId(
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.images
        WHERE p.id IN :ids
    """)
    List<Product> findProductsWithImagesByIds(@Param("ids") List<Long> ids);

    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.images
        WHERE p.id = :id
          AND p.active = true
          AND p.deleted = false
    """)
    Optional<Product> findActiveByIdWithImages(@Param("id") Long id);

    /*
     * Backward-compatible method.
     * Needed because WishlistService is still calling findByIdWithImages(id).
     */
    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.images
        WHERE p.id = :id
          AND p.active = true
          AND p.deleted = false
    """)
    Optional<Product> findByIdWithImages(@Param("id") Long id);

    @Query("""
        SELECT p.id
        FROM Product p
        ORDER BY p.displayOrder ASC, p.id ASC
    """)
    List<Long> findAdminProductIds(Pageable pageable);

    @Query("""
        SELECT DISTINCT p
        FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.images
        WHERE p.id = :id
    """)
    Optional<Product> findAdminByIdWithImages(@Param("id") Long id);

    @Query("""
        SELECT COALESCE(MAX(p.displayOrder), 0)
        FROM Product p
    """)
    Integer findMaxDisplayOrder();
}