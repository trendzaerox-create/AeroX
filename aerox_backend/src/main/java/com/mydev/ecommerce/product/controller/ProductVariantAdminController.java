package com.mydev.ecommerce.product.controller;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductVariantCandidateResponse;
import com.mydev.ecommerce.product.dto.ProductVariantLinkRequest;
import com.mydev.ecommerce.product.dto.ProductVariantUpdateRequest;
import com.mydev.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class ProductVariantAdminController {

    private final ProductService productService;

    public ProductVariantAdminController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Search existing products that the admin can select as a colour sibling.
     *
     * Example:
     * GET /api/admin/products/color-variant/candidates?q=master&excludeProductId=16
     */
    @GetMapping("/color-variant/candidates")
    public List<ProductVariantCandidateResponse> findCandidates(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(required = false) Long excludeProductId
    ) {
        return productService.findColorVariantCandidates(q, excludeProductId);
    }

    /**
     * Links the current product to an existing product.
     * If neither product has a group, the service creates a new safe group code.
     * If one product already has a group, the other product joins that group.
     */
    @PatchMapping("/{id}/color-variant/link")
    public ProductResponse linkColorVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantLinkRequest request
    ) {
        return productService.linkColorVariant(id, request);
    }

    /**
     * Directly edits colour metadata, display order, or group code.
     * Sending a blank/null variantGroupCode removes the product from its group.
     */
    @PatchMapping("/{id}/color-variant")
    public ProductResponse updateColorVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantUpdateRequest request
    ) {
        return productService.updateColorVariantDetails(id, request);
    }

    /**
     * Explicit ungroup action for the admin UI.
     * The product itself is not deleted.
     */
    @DeleteMapping("/{id}/color-variant")
    public ProductResponse removeColorVariant(@PathVariable Long id) {
        return productService.removeColorVariant(id);
    }
}
