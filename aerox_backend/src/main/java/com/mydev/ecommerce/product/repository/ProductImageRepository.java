package com.mydev.ecommerce.product.repository;

import com.mydev.ecommerce.product.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage,Long> {

  List<ProductImage> findByProduct_Id(Long productId);

}