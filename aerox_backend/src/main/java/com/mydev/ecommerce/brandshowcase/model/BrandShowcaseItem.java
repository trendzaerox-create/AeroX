package com.mydev.ecommerce.brandshowcase.model;

import com.mydev.ecommerce.product.model.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "brand_showcase_items")
@Getter
@Setter
public class BrandShowcaseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_showcase_id", nullable = false)
    private BrandShowcase brandShowcase;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}