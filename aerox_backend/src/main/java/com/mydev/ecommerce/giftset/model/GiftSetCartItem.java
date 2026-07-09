package com.mydev.ecommerce.giftset.model;

import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.product.model.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "gift_set_cart_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_gift_set_cart_product",
                        columnNames = {"gift_set_cart_id", "product_id"}
                )
        }
)
@Getter
@Setter
public class GiftSetCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gift_set_cart_id", nullable = false)
    private GiftSetCart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gift_box_id", nullable = false)
    private GiftBox giftBox;

    @Column(name = "product_price_snapshot", nullable = false)
    private Integer productPriceSnapshot;

    @Column(name = "gift_box_price_snapshot", nullable = false)
    private Integer giftBoxPriceSnapshot;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}