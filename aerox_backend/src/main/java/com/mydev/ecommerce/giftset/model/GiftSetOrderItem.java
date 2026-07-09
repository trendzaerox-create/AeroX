package com.mydev.ecommerce.giftset.model;

import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.product.model.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "gift_set_order_items")
@Getter
@Setter
public class GiftSetOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gift_set_order_id", nullable = false)
    private GiftSetOrder order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_title", nullable = false, length = 200)
    private String productTitle;

    @Column(name = "product_image_url", length = 500)
    private String productImageUrl;

    @Column(name = "product_price_snapshot", nullable = false, precision = 12, scale = 2)
    private BigDecimal productPriceSnapshot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gift_box_id", nullable = false)
    private GiftBox giftBox;

    @Column(name = "gift_box_name", nullable = false, length = 200)
    private String giftBoxName;

    @Column(name = "gift_box_image_url", length = 500)
    private String giftBoxImageUrl;

    @Column(name = "gift_box_price_snapshot", nullable = false, precision = 12, scale = 2)
    private BigDecimal giftBoxPriceSnapshot;

    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}