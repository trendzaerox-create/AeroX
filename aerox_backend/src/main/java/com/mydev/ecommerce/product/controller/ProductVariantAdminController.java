package com.mydev.ecommerce.product.controller;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductVariantUpdateRequest;
import com.mydev.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class ProductVariantAdminController {

    private final ProductService productService;

    public ProductVariantAdminController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Your existing Spring Security configuration should already protect
     * /api/admin/**. This endpoint assigns one product to a colour family.
     */
    @PatchMapping("/{id}/color-variant")
    public ProductResponse updateColorVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantUpdateRequest request
    ) {
        return productService.updateColorVariantDetails(id, request);
    }
}
