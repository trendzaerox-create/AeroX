package com.mydev.ecommerce.order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "order_shipments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_order_shipments_order_id",
                        columnNames = "order_id"
                ),
                @UniqueConstraint(
                        name = "uk_order_shipments_tracking_id",
                        columnNames = "tracking_id"
                )
        }
)
@Getter
@Setter
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "order_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(
                    name = "fk_order_shipments_order"
            )
    )
    private Order order;

    @Column(
            name = "courier_name",
            nullable = false,
            length = 100
    )
    private String courierName;

    @Column(
            name = "tracking_id",
            nullable = false,
            unique = true,
            length = 150
    )
    private String trackingId;

    @Column(
            name = "tracking_url",
            length = 500
    )
    private String trackingUrl;

    @Column(
            name = "shipped_at",
            nullable = false
    )
    private OffsetDateTime shippedAt;

    @Column(
            name = "created_at",
            nullable = false
    )
    private OffsetDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        OffsetDateTime now =
                OffsetDateTime.now();

        if (this.shippedAt == null) {
            this.shippedAt = now;
        }

        if (this.createdAt == null) {
            this.createdAt = now;
        }

        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt =
                OffsetDateTime.now();
    }
}