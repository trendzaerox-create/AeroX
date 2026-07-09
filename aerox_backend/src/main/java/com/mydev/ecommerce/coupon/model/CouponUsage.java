package com.mydev.ecommerce.coupon.model;

import com.mydev.ecommerce.order.model.Order;
import com.mydev.ecommerce.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "coupon_usages")
@Getter
@Setter
public class CouponUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "used_at", nullable = false)
    private OffsetDateTime usedAt;

    @PrePersist
    public void onCreate() {
        if (this.usedAt == null) {
            this.usedAt = OffsetDateTime.now();
        }
    }
}