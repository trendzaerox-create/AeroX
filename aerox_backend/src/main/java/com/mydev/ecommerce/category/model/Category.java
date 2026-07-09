package com.mydev.ecommerce.category.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "category_images",
            joinColumns = @JoinColumn(name = "category_id")
    )
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "category_banner_images",
            joinColumns = @JoinColumn(name = "category_id")
    )
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url", length = 500)
    private List<String> bannerImageUrls = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "category_thin_banner_images",
            joinColumns = @JoinColumn(name = "category_id")
    )
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url", length = 500)
    private List<String> thinBannerImageUrls = new ArrayList<>();
}