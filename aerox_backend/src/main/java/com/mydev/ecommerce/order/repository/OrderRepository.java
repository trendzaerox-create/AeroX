
// // package com.mydev.ecommerce.order.repository;

// // import com.mydev.ecommerce.order.model.Order;
// // import org.springframework.data.jpa.repository.EntityGraph;
// // import org.springframework.data.jpa.repository.JpaRepository;

// // import java.util.List;
// // import java.util.Optional;

// // public interface OrderRepository
// //         extends JpaRepository<Order, Long> {

// //     @EntityGraph(attributePaths = {
// //             "items",
// //             "items.product",
// //             "shipment"
// //     })
// //     List<Order> findByUserIdOrderByIdDesc(
// //             Long userId
// //     );

// //     @EntityGraph(attributePaths = {
// //             "items",
// //             "items.product",
// //             "shipment"
// //     })
// //     Optional<Order> findByIdAndUserId(
// //             Long id,
// //             Long userId
// //     );

// //     @EntityGraph(attributePaths = {
// //             "items",
// //             "items.product",
// //             "shipment"
// //     })
// //     List<Order> findAllByOrderByIdDesc();

// //     @EntityGraph(attributePaths = {
// //             "items",
// //             "items.product",
// //             "shipment",
// //             "user"
// //     })
// //     Optional<Order> findDetailedById(
// //             Long id
// //     );
// // }















// package com.mydev.ecommerce.order.repository;

// import com.mydev.ecommerce.order.model.Order;
// import org.springframework.data.jpa.repository.EntityGraph;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;
// import java.util.Optional;

// public interface OrderRepository
//         extends JpaRepository<Order, Long> {

//     @EntityGraph(attributePaths = {
//             "items",
//             "items.product",
//             "shipment"
//     })
//     List<Order> findByUserIdOrderByIdDesc(
//             Long userId
//     );

//     @EntityGraph(attributePaths = {
//             "items",
//             "items.product",
//             "shipment"
//     })
//     Optional<Order> findByIdAndUserId(
//             Long id,
//             Long userId
//     );

//     @EntityGraph(attributePaths = {
//             "items",
//             "items.product",
//             "shipment"
//     })
//     List<Order> findAllByOrderByIdDesc();

//     @EntityGraph(attributePaths = {
//             "items",
//             "items.product",
//             "shipment",
//             "user"
//     })
//     Optional<Order> findDetailedById(
//             Long id
//     );

//     // ✅ NEW: find admin order by order number like TF-BCC09946D1
//     @EntityGraph(attributePaths = {
//             "items",
//             "items.product",
//             "shipment",
//             "user"
//     })
//     Optional<Order> findDetailedByOrderNumber(
//             String orderNumber
//     );
// }




















package com.mydev.ecommerce.order.repository;

import com.mydev.ecommerce.order.model.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByIdDesc();

    List<Order> findByUserIdOrderByIdDesc(Long userId);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Order> findByRazorpayPaymentId(String razorpayPaymentId);

    boolean existsByRazorpayPaymentIdAndIdNot(
            String razorpayPaymentId,
            Long orderId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select o
            from #{#entityName} o
            where o.id = :orderId
              and o.user.id = :userId
            """)
    Optional<Order> findLockedByIdAndUserId(
            @Param("orderId") Long orderId,
            @Param("userId") Long userId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select o
            from #{#entityName} o
            where o.razorpayOrderId = :razorpayOrderId
            """)
    Optional<Order> findLockedByRazorpayOrderId(
            @Param("razorpayOrderId") String razorpayOrderId
    );

    @Query("""
            select distinct o
            from #{#entityName} o
            left join fetch o.items i
            left join fetch i.product
            left join fetch o.user
            left join fetch o.shipment
            where o.id = :orderId
            """)
    Optional<Order> findDetailedById(
            @Param("orderId") Long orderId
    );

    @Query("""
            select distinct o
            from #{#entityName} o
            left join fetch o.items i
            left join fetch i.product
            left join fetch o.user
            left join fetch o.shipment
            where upper(o.orderNumber) = upper(:orderNumber)
            """)
    Optional<Order> findDetailedByOrderNumber(
            @Param("orderNumber") String orderNumber
    );
}