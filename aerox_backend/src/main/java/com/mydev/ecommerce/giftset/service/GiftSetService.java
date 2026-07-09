package com.mydev.ecommerce.giftset.service;

import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.giftbox.service.GiftBoxService;
import com.mydev.ecommerce.giftset.dto.GiftSetItemRequest;
import com.mydev.ecommerce.giftset.dto.GiftSetItemResponse;
import com.mydev.ecommerce.giftset.dto.GiftSetRequest;
import com.mydev.ecommerce.giftset.dto.GiftSetSummaryResponse;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductImage;
import com.mydev.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class GiftSetService {

    private final ProductRepository productRepository;
    private final GiftBoxService giftBoxService;

    public GiftSetService(ProductRepository productRepository, GiftBoxService giftBoxService) {
        this.productRepository = productRepository;
        this.giftBoxService = giftBoxService;
    }

    public GiftSetSummaryResponse calculate(GiftSetRequest request) {
        validateRequest(request);

        List<GiftSetItemResponse> itemResponses = new ArrayList<>();
        Set<Long> uniqueProductIds = new HashSet<>();

        int subtotal = 0;

        for (GiftSetItemRequest item : request.getItems()) {
            if (!uniqueProductIds.add(item.getProductId())) {
                throw new IllegalArgumentException("Duplicate products are not allowed in a gift set");
            }

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProductId()));

            if (product.isDeleted() || !product.isActive()) {
                throw new IllegalArgumentException("Product is not available: " + item.getProductId());
            }

            if (product.getStock() == null || product.getStock() <= 0) {
                throw new IllegalArgumentException("Product is out of stock: " + item.getProductId());
            }

            GiftBox giftBox = giftBoxService.getActiveGiftBoxEntity(item.getGiftBoxId());

            if (giftBox.getStock() == null || giftBox.getStock() <= 0) {
                throw new IllegalArgumentException("Gift box is out of stock: " + item.getGiftBoxId());
            }

            int productPrice = product.getPriceInr() == null ? 0 : product.getPriceInr();
            int giftBoxPrice = giftBox.getPriceInr() == null ? 0 : giftBox.getPriceInr();
            int lineTotal = productPrice + giftBoxPrice;

            subtotal += lineTotal;

            itemResponses.add(
                    GiftSetItemResponse.builder()
                            .productId(product.getId())
                            .productTitle(product.getTitle())
                            .productPriceInr(productPrice)
                            .productImagePath(extractFirstProductImage(product))
                            .giftBoxId(giftBox.getId())
                            .giftBoxName(giftBox.getName())
                            .giftBoxPriceInr(giftBoxPrice)
                            .giftBoxImagePath(giftBox.getImagePath())
                            .lineTotalInr(lineTotal)
                            .build()
            );
        }

        int totalProducts = itemResponses.size();
        int discountPercent = getDiscountPercent(totalProducts);
        int discountAmount = Math.round(subtotal * (discountPercent / 100.0f));
        int finalTotal = subtotal - discountAmount;

        return GiftSetSummaryResponse.builder()
                .items(itemResponses)
                .totalProducts(totalProducts)
                .subtotalInr(subtotal)
                .discountPercent(discountPercent)
                .discountAmountInr(discountAmount)
                .finalTotalInr(finalTotal)
                .build();
    }

    private void validateRequest(GiftSetRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("At least 1 gift set item is required");
        }

        if (request.getItems().size() > 5) {
            throw new IllegalArgumentException("Maximum 5 products allowed in gift set");
        }

        for (GiftSetItemRequest item : request.getItems()) {
            if (item.getProductId() == null) {
                throw new IllegalArgumentException("Product id is required");
            }
            if (item.getGiftBoxId() == null) {
                throw new IllegalArgumentException("Gift box id is required");
            }
        }
    }

    private int getDiscountPercent(int totalProducts) {
        if (totalProducts == 2) {
            return 10;
        }
        if (totalProducts >= 3 && totalProducts <= 5) {
            return 15;
        }
        return 0;
    }

    private String extractFirstProductImage(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }

        ProductImage image = product.getImages().get(0);
        if (image == null) {
            return null;
        }

        try {
            return (String) ProductImage.class.getMethod("getImagePath").invoke(image);
        } catch (Exception ignored) {
        }

        try {
            return (String) ProductImage.class.getMethod("getUrl").invoke(image);
        } catch (Exception ignored) {
        }

        try {
            return (String) ProductImage.class.getMethod("getImageUrl").invoke(image);
        } catch (Exception ignored) {
        }

        return null;
    }
}