

package com.mydev.ecommerce.brandshowcase.repository;

import com.mydev.ecommerce.brandshowcase.model.BrandShowcaseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandShowcaseItemRepository extends JpaRepository<BrandShowcaseItem, Long> {
}