package com.mydev.ecommerce.shipment.model;

import com.mydev.ecommerce.order.model.Order;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

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

    @Column(name = "pickup_generated_at")
    private OffsetDateTime pickupGeneratedAt;

    @Column(name = "request_json", columnDefinition = "TEXT")
    private String requestJson;

    @Column(name = "response_json", columnDefinition = "TEXT")
    private String responseJson;

    @Column(name = "webhook_json", columnDefinition = "TEXT")
    private String webhookJson;

    @Column(name = "tracking_json", columnDefinition = "TEXT")
    private String trackingJson;

    @Version
    @Column(name = "version", nullable = false)
    private long version;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
}
