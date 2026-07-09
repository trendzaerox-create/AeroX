
package com.mydev.ecommerce.shipment.model;

import com.mydev.ecommerce.order.model.Order;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "shiprocket_orders",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_shiprocket_orders_order_id",
                        columnNames = "order_id"
                ),
                @UniqueConstraint(
                        name = "uk_shiprocket_orders_shiprocket_order_id",
                        columnNames = "shiprocket_order_id"
                ),
                @UniqueConstraint(
                        name = "uk_shiprocket_orders_shiprocket_shipment_id",
                        columnNames = "shiprocket_shipment_id"
                )
        },
        indexes = {
                @Index(
                        name = "idx_shiprocket_orders_order_id",
                        columnList = "order_id"
                ),
                @Index(
                        name = "idx_shiprocket_orders_awb_code",
                        columnList = "awb_code"
                ),
                @Index(
                        name = "idx_shiprocket_orders_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_shiprocket_orders_last_tracked_at",
                        columnList = "last_tracked_at"
                )
        }
)
@Getter
@Setter
public class ShiprocketOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Separate mapping from your existing Order entity.
     * This keeps the integration safe and avoids changing Order.java.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "order_id",
            nullable = false
    )
    private Order order;

    @Column(name = "shiprocket_order_id")
    private Long shiprocketOrderId;

    @Column(name = "shiprocket_shipment_id")
    private Long shiprocketShipmentId;

    @Column(name = "awb_code", length = 150)
    private String awbCode;

    @Column(name = "courier_name", length = 150)
    private String courierName;

    @Column(name = "courier_company_id", length = 80)
    private String courierCompanyId;

    @Column(name = "tracking_url", length = 500)
    private String trackingUrl;

    @Column(name = "status", length = 80)
    private String status;

    @Column(name = "status_code", length = 40)
    private String statusCode;

    @Column(name = "latest_activity", columnDefinition = "TEXT")
    private String latestActivity;

    @Column(name = "latest_location", length = 255)
    private String latestLocation;

    @Column(name = "last_tracked_at")
    private OffsetDateTime lastTrackedAt;

    @Column(name = "picked_up_at")
    private OffsetDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Column(name = "expected_delivery_at")
    private OffsetDateTime expectedDeliveryAt;

    @Column(name = "request_json", columnDefinition = "TEXT")
    private String requestJson;

    @Column(name = "response_json", columnDefinition = "TEXT")
    private String responseJson;

    @Column(name = "webhook_json", columnDefinition = "TEXT")
    private String webhookJson;

    @Column(name = "tracking_json", columnDefinition = "TEXT")
    private String trackingJson;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        OffsetDateTime now =
                OffsetDateTime.now();

        if (this.createdAt == null) {
            this.createdAt = now;
        }

        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt =
                OffsetDateTime.now();
    }
}