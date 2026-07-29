

// package com.mydev.ecommerce.product.service;

// import com.mydev.ecommerce.product.dto.ProductResponse;
// import com.mydev.ecommerce.product.dto.ProductReviewResponse;
// import com.mydev.ecommerce.product.model.Product;
// import com.mydev.ecommerce.product.model.ProductReview;
// import com.mydev.ecommerce.product.repository.ProductRepository;
// import com.mydev.ecommerce.product.repository.ProductReviewRepository;
// import jakarta.persistence.EntityNotFoundException;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Comparator;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// public class ProductService {

//     private final ProductRepository repo;
//     private final ProductReviewRepository reviewRepo;

//     public ProductService(ProductRepository repo, ProductReviewRepository reviewRepo) {
//         this.repo = repo;
//         this.reviewRepo = reviewRepo;
//     }

//     @Transactional(readOnly = true)
//     public List<ProductResponse> getProducts(Long categoryId, int page, int size) {
//         int safePage = Math.max(page, 0);
//         int safeSize = Math.min(Math.max(size, 1), 50);

//         Pageable pageable = PageRequest.of(safePage, safeSize);

//         List<Long> ids = categoryId != null
//                 ? repo.findActiveProductIdsByCategoryId(categoryId, pageable)
//                 : repo.findActiveProductIds(pageable);

//         if (ids.isEmpty()) {
//             return List.of();
//         }

//         List<Product> products = repo.findProductsWithImagesByIds(ids);
//         Map<Long, ReviewSummary> reviewSummaryMap = getReviewSummaryMap(ids);

//         return products.stream()
//                 .sorted(
//                         Comparator
//                                 .comparing(
//                                         Product::getDisplayOrder,
//                                         Comparator.nullsLast(Integer::compareTo)
//                                 )
//                                 .thenComparing(Product::getId)
//                 )
//                 .map(product -> mapToDTO(
//                         product,
//                         false,
//                         reviewSummaryMap.get(product.getId())
//                 ))
//                 .toList();
//     }

//     @Transactional(readOnly = true)
//     public ProductResponse getProduct(Long id) {
//         Product product = repo.findActiveByIdWithImages(id)
//                 .orElseThrow(() -> new EntityNotFoundException("Product not found"));

//         return mapToDTO(product, true, null);
//     }

//     @Transactional(readOnly = true)
//     public List<ProductResponse> getAdminProducts(int page, int size) {
//         int safePage = Math.max(page, 0);
//         int safeSize = Math.min(Math.max(size, 1), 100);

//         Pageable pageable = PageRequest.of(safePage, safeSize);

//         List<Long> ids = repo.findAdminProductIds(pageable);

//         if (ids.isEmpty()) {
//             return List.of();
//         }

//         List<Product> products = repo.findProductsWithImagesByIds(ids);
//         Map<Long, ReviewSummary> reviewSummaryMap = getReviewSummaryMap(ids);

//         return products.stream()
//                 .sorted(
//                         Comparator
//                                 .comparing(
//                                         Product::getDisplayOrder,
//                                         Comparator.nullsLast(Integer::compareTo)
//                                 )
//                                 .thenComparing(Product::getId)
//                 )
//                 .map(product -> mapToDTO(
//                         product,
//                         false,
//                         reviewSummaryMap.get(product.getId())
//                 ))
//                 .toList();
//     }

//     @Transactional(readOnly = true)
//     public ProductResponse getAdminProduct(Long id) {
//         Product product = repo.findAdminByIdWithImages(id)
//                 .orElseThrow(() -> new EntityNotFoundException("Product not found"));

//         return mapToDTO(product, true, null);
//     }

//     private ProductResponse mapToDTO(
//             Product product,
//             boolean includeReviews,
//             ReviewSummary preloadedSummary
//     ) {
//         List<String> images = product.getImages()
//                 .stream()
//                 .map(image -> image.getImageUrl())
//                 .collect(Collectors.toList());

//         List<ProductReviewResponse> reviews = List.of();
//         Double averageRating = 0.0;
//         Long reviewCount = 0L;

//         if (includeReviews) {
//             List<ProductReview> productReviews =
//                     reviewRepo.findByProductIdOrderByIdDesc(product.getId());

//             reviews = productReviews.stream()
//                     .map(review -> new ProductReviewResponse(
//                             review.getId(),
//                             review.getReviewerName(),
//                             review.getRating(),
//                             review.getReviewText(),
//                             review.isFeatured()
//                     ))
//                     .toList();

//             reviewCount = (long) productReviews.size();

//             averageRating = roundAverage(
//                     productReviews.stream()
//                             .mapToInt(ProductReview::getRating)
//                             .average()
//                             .orElse(0.0)
//             );
//         } else {
//             ReviewSummary safeSummary = preloadedSummary == null
//                     ? new ReviewSummary(0.0, 0L)
//                     : preloadedSummary;

//             averageRating = safeSummary.averageRating();
//             reviewCount = safeSummary.reviewCount();
//         }

//         return new ProductResponse(
//                 product.getId(),
//                 product.getTitle(),
//                 product.getDescription(),

//                 product.getPriceInr(),
//                 product.getMrpInr(),
//                 product.getDiscountInr(),
//                 product.getDiscountPercent(),

//                 product.getStock(),

//                 product.getDisplayOrder(),
//                 product.getCategory() != null ? product.getCategory().getId() : null,
//                 product.getCategory() != null ? product.getCategory().getName() : null,

//                 images,
//                 reviews,
//                 averageRating,
//                 reviewCount,

//                 product.getShortHighlights(),
//                 product.getSpecificationsJson(),
//                 product.getFeatureHighlightsJson(),
//                 product.getFaqJson(),
//                 product.getWarrantyInfo(),
//                 product.getBoxContentsJson(),
//                 product.getCompatibility(),
//                 product.getDemoVideoUrl(),
//                 product.getPdpBannersJson()
//         );
//     }

//     private Map<Long, ReviewSummary> getReviewSummaryMap(List<Long> productIds) {
//         if (productIds == null || productIds.isEmpty()) {
//             return Map.of();
//         }

//         return reviewRepo.findReviewStatsByProductIds(productIds)
//                 .stream()
//                 .collect(Collectors.toMap(
//                         ProductReviewRepository.ReviewStatsProjection::getProductId,
//                         stats -> new ReviewSummary(
//                                 roundAverage(stats.getAverageRating()),
//                                 stats.getReviewCount() == null ? 0L : stats.getReviewCount()
//                         )
//                 ));
//     }

//     private Double roundAverage(Double average) {
//         if (average == null) {
//             return 0.0;
//         }

//         return Math.round(average * 10.0) / 10.0;
//     }

//     private record ReviewSummary(
//             Double averageRating,
//             Long reviewCount
//     ) {}
// }



















package com.mydev.ecommerce.product.service;

import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductReviewResponse;
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
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final ProductReviewRepository reviewRepo;

    public ProductService(ProductRepository repo, ProductReviewRepository reviewRepo) {
        this.repo = repo;
        this.reviewRepo = reviewRepo;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(Long categoryId, int page, int size) {
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
    public List<ProductResponse> getAdminProducts(int page, int size) {
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
     * Replaces the colour-family metadata for one existing product.
     * Products with the same variantGroupCode appear together on the PDP.
     */
    @Transactional
    public ProductResponse updateColorVariantDetails(
            Long productId,
            ProductVariantUpdateRequest request
    ) {
        Product product = repo.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        product.setVariantGroupCode(normalizeGroupCode(request.variantGroupCode()));
        product.setColorName(normalizeNullableText(request.colorName()));
        product.setColorHex(normalizeColorHex(request.colorHex()));
        product.setVariantDisplayOrder(
                request.variantDisplayOrder() == null
                        ? 0
                        : request.variantDisplayOrder()
        );

        repo.saveAndFlush(product);

        Product reloaded = repo.findAdminByIdWithImages(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ReviewSummary reviewSummary = getReviewSummaryMap(List.of(productId))
                .getOrDefault(productId, new ReviewSummary(0.0, 0L));

        return mapToDTO(
                reloaded,
                false,
                reviewSummary,
                loadActiveColorVariants(reloaded)
        );
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
        String groupCode = normalizeNullableText(product.getVariantGroupCode());

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

    private String normalizeGroupCode(String value) {
        String normalized = normalizeNullableText(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }

    private String normalizeColorHex(String value) {
        String normalized = normalizeNullableText(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }

    private String normalizeNullableText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
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
