

package com.mydev.ecommerce.brandshowcase.service;

import com.mydev.ecommerce.brandshowcase.dto.BrandShowcaseRequest;
import com.mydev.ecommerce.brandshowcase.dto.BrandShowcaseResponse;
import com.mydev.ecommerce.brandshowcase.model.BrandShowcase;
import com.mydev.ecommerce.brandshowcase.model.BrandShowcaseItem;
import com.mydev.ecommerce.brandshowcase.repository.BrandShowcaseRepository;
import com.mydev.ecommerce.common.service.FileStorageService;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductImage;
import com.mydev.ecommerce.product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BrandShowcaseService {

    private final BrandShowcaseRepository brandShowcaseRepository;
    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public BrandShowcaseService(
            BrandShowcaseRepository brandShowcaseRepository,
            ProductRepository productRepository,
            FileStorageService fileStorageService
    ) {
        this.brandShowcaseRepository = brandShowcaseRepository;
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<BrandShowcaseResponse> getActiveShowcases() {
        return brandShowcaseRepository.findByActiveTrueAndDeletedFalseOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BrandShowcaseResponse getActiveShowcase(Long id) {
        BrandShowcase showcase = brandShowcaseRepository.findByIdAndActiveTrueAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand showcase not found"));

        return toResponse(showcase);
    }

    @Transactional(readOnly = true)
    public List<BrandShowcaseResponse> getAllAdminShowcases() {
        return brandShowcaseRepository.findByDeletedFalseOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BrandShowcaseResponse getAdminShowcase(Long id) {
        BrandShowcase showcase = brandShowcaseRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand showcase not found"));

        return toResponse(showcase);
    }

    public BrandShowcaseResponse create(BrandShowcaseRequest request) {
        validateProductIds(request.productIds());

        BrandShowcase showcase = new BrandShowcase();
        applyRequest(showcase, request);

        BrandShowcase saved = brandShowcaseRepository.save(showcase);
        return toResponse(saved);
    }

    public BrandShowcaseResponse update(Long id, BrandShowcaseRequest request) {
        validateProductIds(request.productIds());

        BrandShowcase showcase = brandShowcaseRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand showcase not found"));

        String oldCloudinaryPublicId = showcase.getCloudinaryPublicId();
        String newCloudinaryPublicId = request.cloudinaryPublicId();

        applyRequest(showcase, request);

        BrandShowcase saved = brandShowcaseRepository.save(showcase);

        if (oldCloudinaryPublicId != null
                && !oldCloudinaryPublicId.isBlank()
                && newCloudinaryPublicId != null
                && !newCloudinaryPublicId.isBlank()
                && !oldCloudinaryPublicId.equals(newCloudinaryPublicId)) {
            fileStorageService.deleteFile(oldCloudinaryPublicId);
        }

        return toResponse(saved);
    }

    public void delete(Long id) {
        BrandShowcase showcase = brandShowcaseRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brand showcase not found"));

        showcase.setDeleted(true);
        showcase.setActive(false);
        brandShowcaseRepository.save(showcase);
    }

    private void applyRequest(BrandShowcase showcase, BrandShowcaseRequest request) {
        showcase.setTitle(request.title().trim());
        showcase.setSubtitle(request.subtitle() != null ? request.subtitle().trim() : null);
        showcase.setModelImageUrl(request.modelImageUrl().trim());
        showcase.setCloudinaryPublicId(
                request.cloudinaryPublicId() != null && !request.cloudinaryPublicId().isBlank()
                        ? request.cloudinaryPublicId().trim()
                        : null
        );
        showcase.setDisplayOrder(request.displayOrder());
        showcase.setActive(request.active());

        showcase.getItems().clear();
        attachProducts(showcase, request.productIds());
    }

    private void attachProducts(BrandShowcase showcase, List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);

        if (products.size() != productIds.size()) {
            Set<Long> foundIds = products.stream()
                    .map(Product::getId)
                    .collect(Collectors.toSet());

            List<Long> missingIds = productIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Some products were not found: " + missingIds
            );
        }

        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        int order = 0;
        for (Long productId : productIds) {
            Product product = productMap.get(productId);

            if (product == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product id: " + productId);
            }

            if (!product.isActive() || product.isDeleted()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Product is inactive or deleted: " + productId
                );
            }

            BrandShowcaseItem item = new BrandShowcaseItem();
            item.setBrandShowcase(showcase);
            item.setProduct(product);
            item.setDisplayOrder(order++);
            showcase.getItems().add(item);
        }
    }

    private void validateProductIds(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least 1 product is required");
        }

        Set<Long> unique = new HashSet<>(productIds);
        if (unique.size() != productIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate product IDs are not allowed");
        }
    }

    private BrandShowcaseResponse toResponse(BrandShowcase showcase) {
        List<BrandShowcaseResponse.BrandShowcaseProductResponse> products = showcase.getItems()
                .stream()
                .map(BrandShowcaseItem::getProduct)
                .map(product -> new BrandShowcaseResponse.BrandShowcaseProductResponse(
                        product.getId(),
                        product.getTitle(),
                        product.getDescription(),
                        product.getPriceInr(),
                        product.getStock(),
                        product.getCategory() != null ? product.getCategory().getId() : null,
                        product.getCategory() != null ? product.getCategory().getName() : null,
                        getFirstImageUrl(product),
                        getAllImageUrls(product),
                        product.isActive()
                ))
                .toList();

        return new BrandShowcaseResponse(
                showcase.getId(),
                showcase.getTitle(),
                showcase.getSubtitle(),
                showcase.getModelImageUrl(),
                showcase.getCloudinaryPublicId(),
                showcase.getDisplayOrder(),
                showcase.isActive(),
                showcase.getCreatedAt(),
                showcase.getUpdatedAt(),
                products
        );
    }

    private String getFirstImageUrl(Product product) {
        List<String> imageUrls = getAllImageUrls(product);
        return imageUrls.isEmpty() ? null : imageUrls.get(0);
    }

    private List<String> getAllImageUrls(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return List.of();
        }

        return product.getImages()
                .stream()
                .map(ProductImage::getImageUrl)
                .filter(Objects::nonNull)
                .filter(url -> !url.isBlank())
                .toList();
    }
}