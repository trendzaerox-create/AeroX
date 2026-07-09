

package com.mydev.ecommerce.shipment.repository;

import com.mydev.ecommerce.shipment.model.ShiprocketOrder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShiprocketOrderRepository extends JpaRepository<ShiprocketOrder, Long> {

    @Query("""
        select sr
        from ShiprocketOrder sr
        where sr.order.id = :orderId
    """)
    Optional<ShiprocketOrder> findByOrderId(
            @Param("orderId") Long orderId
    );

    @Query("""
        select count(sr) > 0
        from ShiprocketOrder sr
        where sr.order.id = :orderId
    """)
    boolean existsByOrderId(
            @Param("orderId") Long orderId
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where o.id = :orderId
    """)
    Optional<ShiprocketOrder> findByOrderIdWithOrder(
            @Param("orderId") Long orderId
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where sr.id = :id
    """)
    Optional<ShiprocketOrder> findByIdWithOrder(
            @Param("id") Long id
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where upper(sr.awbCode) = upper(:awbCode)
    """)
    Optional<ShiprocketOrder> findByAwbCodeWithOrder(
            @Param("awbCode") String awbCode
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where sr.shiprocketShipmentId = :shipmentId
    """)
    Optional<ShiprocketOrder> findByShiprocketShipmentIdWithOrder(
            @Param("shipmentId") Long shipmentId
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where sr.shiprocketOrderId = :shiprocketOrderId
    """)
    Optional<ShiprocketOrder> findByShiprocketOrderIdWithOrder(
            @Param("shiprocketOrderId") Long shiprocketOrderId
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where o.orderNumber = :orderNumber
    """)
    Optional<ShiprocketOrder> findByEcommerceOrderNumberWithOrder(
            @Param("orderNumber") String orderNumber
    );

    @Query("""
        select sr
        from ShiprocketOrder sr
        join fetch sr.order o
        where sr.awbCode is not null
          and sr.awbCode <> ''
          and (
                sr.status is null
                or (
                    lower(sr.status) not like '%delivered%'
                    and lower(sr.status) not like '%cancel%'
                    and lower(sr.status) not like '%rto%'
                    and lower(sr.status) not like '%return%'
                )
          )
        order by
          case when sr.lastTrackedAt is null then 0 else 1 end,
          sr.lastTrackedAt asc
    """)
    List<ShiprocketOrder> findOpenOrdersForTracking(
            Pageable pageable
    );
}