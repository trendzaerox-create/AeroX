


package com.mydev.ecommerce.brandshowcase.repository;

import com.mydev.ecommerce.brandshowcase.model.BrandShowcase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandShowcaseRepository extends JpaRepository<BrandShowcase, Long> {

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.category"
    })
    List<BrandShowcase> findByDeletedFalseOrderByDisplayOrderAscIdAsc();

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.category"
    })
    List<BrandShowcase> findByActiveTrueAndDeletedFalseOrderByDisplayOrderAscIdAsc();

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.category"
    })
    Optional<BrandShowcase> findByIdAndDeletedFalse(Long id);

    @EntityGraph(attributePaths = {
            "items",
            "items.product",
            "items.product.category"
    })
    Optional<BrandShowcase> findByIdAndActiveTrueAndDeletedFalse(Long id);
}