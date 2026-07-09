package com.mydev.ecommerce.order.repository;

import com.mydev.ecommerce.order.model.OrderReviewEmailJob;
import com.mydev.ecommerce.order.model.ReviewEmailStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderReviewEmailJobRepository
        extends JpaRepository<OrderReviewEmailJob, Long> {

    boolean existsByOrderId(Long orderId);

    Optional<OrderReviewEmailJob> findByOrderId(Long orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(
            attributePaths = {
                    "order",
                    "order.user",
                    "order.items",
                    "order.items.product"
            }
    )
    @Query("""
            SELECT job
            FROM OrderReviewEmailJob job
            WHERE job.status = :status
              AND job.scheduledAt <= :now
              AND job.attempts < :maxAttempts
            ORDER BY job.scheduledAt ASC
            """)
    List<OrderReviewEmailJob> findDueJobs(
            @Param("status") ReviewEmailStatus status,
            @Param("now") OffsetDateTime now,
            @Param("maxAttempts") int maxAttempts,
            Pageable pageable
    );
}