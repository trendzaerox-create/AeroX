package com.mydev.ecommerce.product.service;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductReviewResponse;
import com.mydev.ecommerce.product.dto.ProductVariantCandidateResponse;
import com.mydev.ecommerce.product.dto.ProductVariantLinkRequest;
import com.mydev.ecommerce.product.dto.ProductVariantResponse;
import com.mydev.ecommerce.product.dto.ProductVariantUpdateRequest;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductReview;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.product.repository.ProductReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final int MAX_VARIANT_CANDIDATES = 20;

    private final ProductRepository repo;
    private final ProductReviewRepository reviewRepo;

    public ProductService(
            ProductRepository repo,
            ProductReviewRepository reviewRepo
    ) {
        this.repo = repo;
        this.reviewRepo = reviewRepo;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(
            Long categoryId,
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        List<Long> ids = categoryId != null
                ? repo.findActiveProductIdsByCategoryId(categoryId, pageable)
                : repo.findActiveProductIds(pageable);

        if (ids.isEmpty()) {
            return List.of();
        }

        List<Product> products = repo.findProductsWithImagesByIds(ids);
        Map<Long, ReviewSummary> reviewSummaryMap = getReviewSummaryMap(ids);

        return products.stream()
                .sorted(productComparator())
                .map(product -> mapToDTO(
                        product,
                        false,
                        reviewSummaryMap.get(product.getId()),
                        List.of()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product product = repo.findActiveByIdWithImages(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<ProductVariantResponse> colorVariants = loadActiveColorVariants(product);

        return mapToDTO(product, true, null, colorVariants);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAdminProducts(
            int page,
            int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Pageable pageable = PageRequest.of(safePage, safeSize);
        List<Long> ids = repo.findAdminProductIds(pageable);

        if (ids.isEmpty()) {
            return List.of();
        }

        List<Product> products = repo.findProductsWithImagesByIds(ids);
        Map<Long, ReviewSummary> reviewSummaryMap = getReviewSummaryMap(ids);

        return products.stream()
                .sorted(productComparator())
                .map(product -> mapToDTO(
                        product,
                        false,
                        reviewSummaryMap.get(product.getId()),
                        List.of()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getAdminProduct(Long id) {
        Product product = repo.findAdminByIdWithImages(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<ProductVariantResponse> colorVariants = loadActiveColorVariants(product);

        return mapToDTO(product, true, null, colorVariants);
    }

    /**
     * Returns products for the admin's "Group with existing product" selector.
     */
    @Transactional(readOnly = true)
    public List<ProductVariantCandidateResponse> findColorVariantCandidates(
            String query,
            Long excludeProductId
    ) {
        String safeQuery = query == null ? "" : query.trim();

        return repo.searchActiveVariantCandidates(
                        safeQuery,
                        excludeProductId,
                        PageRequest.of(0, MAX_VARIANT_CANDIDATES)
                )
                .stream()
                .map(this::mapToCandidateResponse)
                .toList();
    }

    /**
     * Safely links two existing product rows as colour variants.
     *
     * Rules:
     * 1. A product cannot link to itself.
     * 2. Both products must belong to the same category.
     * 3. Two different existing groups are never merged silently.
     * 4. Colour names must be unique inside one group.
     * 5. If neither product has a group, a generated group code is created.
     */
    @Transactional
    public ProductResponse linkColorVariant(
            Long productId,
            ProductVariantLinkRequest request
    ) {
        if (productId.equals(request.groupWithProductId())) {
            throw new IllegalArgumentException("A product cannot be linked to itself");
        }

        Product currentProduct = findAdminProductEntity(productId);
        Product selectedProduct = findAdminProductEntity(request.groupWithProductId());

        validateSameCategory(currentProduct, selectedProduct);

        String currentGroup = normalizeGroupCode(currentProduct.getVariantGroupCode());
        String selectedGroup = normalizeGroupCode(selectedProduct.getVariantGroupCode());

        if (currentGroup != null
                && selectedGroup != null
                && !currentGroup.equals(selectedGroup)) {
            throw new IllegalArgumentException(
                    "These products already belong to different colour groups. "
                            + "Remove one product from its current group before linking them."
            );
        }

        String groupCode = selectedGroup != null
                ? selectedGroup
                : currentGroup != null
                ? currentGroup
                : generateGroupCode();

        String currentColorName = requireText(
                request.colorName(),
                "Current product colour is required"
        );

        String currentColorHex = requireColorHex(
                request.colorHex(),
                "Current product colour hex is required"
        );

        String selectedColorName = firstNonBlank(
                selectedProduct.getColorName(),
                request.existingProductColorName()
        );

        String selectedColorHex = firstNonBlank(
                selectedProduct.getColorHex(),
                request.existingProductColorHex()
        );

        selectedColorName = requireText(
                selectedColorName,
                "Enter the selected product's existing colour name"
        );

        selectedColorHex = requireColorHex(
                selectedColorHex,
                "Enter the selected product's existing colour hex"
        );

        validateColorIsAvailable(
                groupCode,
                currentColorName,
                currentProduct.getId()
        );

        validateColorIsAvailable(
                groupCode,
                selectedColorName,
                selectedProduct.getId()
        );

        if (currentColorName.equalsIgnoreCase(selectedColorName)) {
            throw new IllegalArgumentException(
                    "Both products cannot use the same colour name in one group"
            );
        }

        boolean currentAlreadyInGroup = groupCode.equals(currentGroup);
        boolean selectedAlreadyInGroup = groupCode.equals(selectedGroup);

        int nextOrder = getNextVariantDisplayOrder(groupCode);

        selectedProduct.setVariantGroupCode(groupCode);
        selectedProduct.setColorName(selectedColorName);
        selectedProduct.setColorHex(selectedColorHex);

        if (!selectedAlreadyInGroup) {
            selectedProduct.setVariantDisplayOrder(
                    currentAlreadyInGroup ? nextOrder++ : 0
            );
        }

        currentProduct.setVariantGroupCode(groupCode);
        currentProduct.setColorName(currentColorName);
        currentProduct.setColorHex(currentColorHex);

        if (request.variantDisplayOrder() != null) {
            currentProduct.setVariantDisplayOrder(request.variantDisplayOrder());
        } else if (!currentAlreadyInGroup) {
            currentProduct.setVariantDisplayOrder(
                    selectedAlreadyInGroup ? nextOrder : Math.max(nextOrder, 1)
            );
        }

        repo.saveAll(List.of(selectedProduct, currentProduct));
        repo.flush();

        return buildAdminProductResponse(currentProduct.getId());
    }

    /**
     * Directly updates one product's group metadata.
     * Blank/null group code means "remove from colour group".
     */
    @Transactional
    public ProductResponse updateColorVariantDetails(
            Long productId,
            ProductVariantUpdateRequest request
    ) {
        Product product = findAdminProductEntity(productId);

        String groupCode = normalizeGroupCode(request.variantGroupCode());

        if (groupCode == null) {
            clearVariantMetadata(product);
            repo.saveAndFlush(product);
            return buildAdminProductResponse(productId);
        }

        String colorName = requireText(
                request.colorName(),
                "Colour name is required while a variant group is assigned"
        );

        String colorHex = requireColorHex(
                request.colorHex(),
                "Colour hex is required while a variant group is assigned"
        );

        validateGroupCategory(groupCode, product);
        validateColorIsAvailable(groupCode, colorName, productId);

        product.setVariantGroupCode(groupCode);
        product.setColorName(colorName);
        product.setColorHex(colorHex);
        product.setVariantDisplayOrder(
                request.variantDisplayOrder() == null
                        ? defaultVariantOrder(product, groupCode)
                        : request.variantDisplayOrder()
        );

        repo.saveAndFlush(product);

        return buildAdminProductResponse(productId);
    }

    /**
     * Removes only the variant relationship. The product remains active.
     */
    @Transactional
    public ProductResponse removeColorVariant(Long productId) {
        Product product = findAdminProductEntity(productId);
        clearVariantMetadata(product);
        repo.saveAndFlush(product);
        return buildAdminProductResponse(productId);
    }

    private ProductResponse buildAdminProductResponse(Long productId) {
        Product reloaded = repo.findAdminByIdWithImages(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        return mapToDTO(
                reloaded,
                true,
                null,
                loadActiveColorVariants(reloaded)
        );
    }

    private Product findAdminProductEntity(Long productId) {
        return repo.findById(productId)
                .filter(product -> !product.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    private void validateSameCategory(
            Product currentProduct,
            Product selectedProduct
    ) {
        Long currentCategoryId = currentProduct.getCategory() == null
                ? null
                : currentProduct.getCategory().getId();

        Long selectedCategoryId = selectedProduct.getCategory() == null
                ? null
                : selectedProduct.getCategory().getId();

        if (currentCategoryId == null
                || selectedCategoryId == null
                || !currentCategoryId.equals(selectedCategoryId)) {
            throw new IllegalArgumentException(
                    "Only products from the same category can be grouped as colour variants"
            );
        }
    }

    private void validateGroupCategory(
            String groupCode,
            Product product
    ) {
        if (product.getCategory() == null) {
            throw new IllegalArgumentException("Product category is required");
        }

        boolean hasDifferentCategory =
                repo.existsByVariantGroupCodeIgnoreCaseAndCategory_IdNotAndDeletedFalse(
                        groupCode,
                        product.getCategory().getId()
                );

        if (hasDifferentCategory) {
            throw new IllegalArgumentException(
                    "This colour group contains products from another category"
            );
        }
    }

    private void validateColorIsAvailable(
            String groupCode,
            String colorName,
            Long excludedProductId
    ) {
        boolean duplicate =
                repo.existsByVariantGroupCodeIgnoreCaseAndColorNameIgnoreCaseAndIdNotAndDeletedFalse(
                        groupCode,
                        colorName,
                        excludedProductId
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "Colour '" + colorName + "' already exists in this variant group"
            );
        }
    }

    private int defaultVariantOrder(
            Product product,
            String targetGroupCode
    ) {
        String existingGroup = normalizeGroupCode(product.getVariantGroupCode());

        if (targetGroupCode.equals(existingGroup)
                && product.getVariantDisplayOrder() != null) {
            return product.getVariantDisplayOrder();
        }

        return getNextVariantDisplayOrder(targetGroupCode);
    }

    private int getNextVariantDisplayOrder(String groupCode) {
        Integer maxOrder = repo.findMaxVariantDisplayOrderByGroupCode(groupCode);
        return maxOrder == null ? 0 : maxOrder + 1;
    }

    private void clearVariantMetadata(Product product) {
        product.setVariantGroupCode(null);
        product.setColorName(null);
        product.setColorHex(null);
        product.setVariantDisplayOrder(0);
    }

    private ProductResponse mapToDTO(
            Product product,
            boolean includeReviews,
            ReviewSummary preloadedSummary,
            List<ProductVariantResponse> colorVariants
    ) {
        List<String> images = product.getImages()
                .stream()
                .map(image -> image.getImageUrl())
                .filter(imageUrl -> imageUrl != null && !imageUrl.isBlank())
                .toList();

        List<ProductReviewResponse> reviews = List.of();
        Double averageRating;
        Long reviewCount;

        if (includeReviews) {
            List<ProductReview> productReviews =
                    reviewRepo.findByProductIdOrderByIdDesc(product.getId());

            reviews = productReviews.stream()
                    .map(review -> new ProductReviewResponse(
                            review.getId(),
                            review.getReviewerName(),
                            review.getRating(),
                            review.getReviewText(),
                            review.isFeatured()
                    ))
                    .toList();

            reviewCount = (long) productReviews.size();

            averageRating = roundAverage(
                    productReviews.stream()
                            .mapToInt(ProductReview::getRating)
                            .average()
                            .orElse(0.0)
            );
        } else {
            ReviewSummary safeSummary = preloadedSummary == null
                    ? new ReviewSummary(0.0, 0L)
                    : preloadedSummary;

            averageRating = safeSummary.averageRating();
            reviewCount = safeSummary.reviewCount();
        }

        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),

                product.getPriceInr(),
                product.getMrpInr(),
                product.getDiscountInr(),
                product.getDiscountPercent(),

                product.getStock(),

                product.getDisplayOrder(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,

                images,
                reviews,
                averageRating,
                reviewCount,

                product.getShortHighlights(),
                product.getSpecificationsJson(),
                product.getFeatureHighlightsJson(),
                product.getFaqJson(),
                product.getWarrantyInfo(),
                product.getBoxContentsJson(),
                product.getCompatibility(),
                product.getDemoVideoUrl(),
                product.getPdpBannersJson(),

                product.getVariantGroupCode(),
                product.getColorName(),
                product.getColorHex(),
                product.getVariantDisplayOrder(),

                colorVariants == null ? List.of() : colorVariants
        );
    }

    private List<ProductVariantResponse> loadActiveColorVariants(Product product) {
        String groupCode = normalizeGroupCode(product.getVariantGroupCode());

        if (groupCode == null) {
            return List.of();
        }

        return repo.findActiveColorVariantsByGroupCode(groupCode)
                .stream()
                .map(this::mapToVariantResponse)
                .toList();
    }

    private ProductVariantResponse mapToVariantResponse(Product product) {
        String thumbnailUrl = product.getImages()
                .stream()
                .map(image -> image.getImageUrl())
                .filter(imageUrl -> imageUrl != null && !imageUrl.isBlank())
                .findFirst()
                .orElse(null);

        return new ProductVariantResponse(
                product.getId(),
                product.getTitle(),
                product.getColorName(),
                product.getColorHex(),
                product.getVariantDisplayOrder(),
                product.getPriceInr(),
                product.getMrpInr(),
                product.getStock(),
                thumbnailUrl
        );
    }

    private ProductVariantCandidateResponse mapToCandidateResponse(Product product) {
        String thumbnailUrl = product.getImages()
                .stream()
                .map(image -> image.getImageUrl())
                .filter(imageUrl -> imageUrl != null && !imageUrl.isBlank())
                .findFirst()
                .orElse(null);

        return new ProductVariantCandidateResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory() == null ? null : product.getCategory().getId(),
                product.getCategory() == null ? null : product.getCategory().getName(),
                product.getVariantGroupCode(),
                product.getColorName(),
                product.getColorHex(),
                thumbnailUrl
        );
    }

    private Comparator<Product> productComparator() {
        return Comparator
                .comparing(
                        Product::getDisplayOrder,
                        Comparator.nullsLast(Integer::compareTo)
                )
                .thenComparing(Product::getId);
    }

    private Map<Long, ReviewSummary> getReviewSummaryMap(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return Map.of();
        }

        return reviewRepo.findReviewStatsByProductIds(productIds)
                .stream()
                .collect(Collectors.toMap(
                        ProductReviewRepository.ReviewStatsProjection::getProductId,
                        stats -> new ReviewSummary(
                                roundAverage(stats.getAverageRating()),
                                stats.getReviewCount() == null ? 0L : stats.getReviewCount()
                        )
                ));
    }

    private String generateGroupCode() {
        return "CVG-" + UUID.randomUUID()
                .toString()
                .toUpperCase(Locale.ROOT);
    }

    private String normalizeGroupCode(String value) {
        String normalized = normalizeNullableText(value);
        return normalized == null
                ? null
                : normalized.toUpperCase(Locale.ROOT);
    }

    private String normalizeColorHex(String value) {
        String normalized = normalizeNullableText(value);
        return normalized == null
                ? null
                : normalized.toUpperCase(Locale.ROOT);
    }

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String firstNonBlank(String first, String second) {
        String normalizedFirst = normalizeNullableText(first);
        return normalizedFirst != null
                ? normalizedFirst
                : normalizeNullableText(second);
    }

    private String requireText(String value, String message) {
        String normalized = normalizeNullableText(value);

        if (normalized == null) {
            throw new IllegalArgumentException(message);
        }

        return normalized;
    }

    private String requireColorHex(String value, String message) {
        String normalized = normalizeColorHex(value);

        if (normalized == null) {
            throw new IllegalArgumentException(message);
        }

        if (!normalized.matches("^#(?:[0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$")) {
            throw new IllegalArgumentException("Colour hex must look like #FFFFFF");
        }

        return normalized;
    }

    private Double roundAverage(Double average) {
        if (average == null) {
            return 0.0;
        }

        return Math.round(average * 10.0) / 10.0;
    }

    private record ReviewSummary(
            Double averageRating,
            Long reviewCount
    ) {}
}
