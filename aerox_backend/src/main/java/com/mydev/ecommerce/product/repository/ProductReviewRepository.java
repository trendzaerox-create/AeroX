// package com.mydev.ecommerce.product.repository;

// import com.mydev.ecommerce.product.model.ProductReview;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;
// import java.util.Optional;

// public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

//     List<ProductReview> findByProductIdOrderByIdDesc(Long productId);

//     Optional<ProductReview> findByIdAndProductId(Long id, Long productId);
// }














package com.mydev.ecommerce.product.repository;

import com.mydev.ecommerce.product.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductIdOrderByIdDesc(Long productId);

    Optional<ProductReview> findByIdAndProductId(Long id, Long productId);

    @Query("""
        SELECT 
            r.product.id AS productId,
            AVG(r.rating) AS averageRating,
            COUNT(r.id) AS reviewCount
        FROM ProductReview r
        WHERE r.product.id IN :productIds
        GROUP BY r.product.id
    """)
    List<ReviewStatsProjection> findReviewStatsByProductIds(
            @Param("productIds") List<Long> productIds
    );

    interface ReviewStatsProjection {
        Long getProductId();
        Double getAverageRating();
        Long getReviewCount();
    }
}