


package com.mydev.ecommerce.product.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mydev.ecommerce.category.model.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    // Final selling price
    @Column(name = "price_inr", nullable = false)
    private Integer priceInr;

    // Maximum Retail Price
    @Column(name = "mrp_inr", nullable = false)
    private Integer mrpInr;

    // Discounted price, not discount amount
    // Example:
    // mrpInr      = 3999
    // discountInr = 1799
    // priceInr    = 1399
    @Column(name = "discount_inr", nullable = false)
    private Integer discountInr = 0;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "short_highlights", columnDefinition = "text")
    private String shortHighlights;

    @Column(name = "specifications_json", columnDefinition = "text")
    private String specificationsJson;

    @Column(name = "feature_highlights_json", columnDefinition = "text")
    private String featureHighlightsJson;

    @Column(name = "faq_json", columnDefinition = "text")
    private String faqJson;

    @Column(name = "warranty_info", columnDefinition = "text")
    private String warrantyInfo;

    @Column(name = "box_contents_json", columnDefinition = "text")
    private String boxContentsJson;

    @Column(name = "compatibility", columnDefinition = "text")
    private String compatibility;

    @Column(name = "demo_video_url", length = 1000)
    private String demoVideoUrl;

    @Column(name = "pdp_banners_json", columnDefinition = "text")
    private String pdpBannersJson;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<ProductImage> images = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id DESC")
    private Set<ProductReview> reviews = new LinkedHashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @Transient
    public Integer getDiscountPercent() {
        if (mrpInr == null || mrpInr <= 0 || discountInr == null || discountInr <= 0) {
            return 0;
        }

        if (discountInr >= mrpInr) {
            return 0;
        }

        return Math.round(((mrpInr - discountInr) * 100f) / mrpInr);
    }
}