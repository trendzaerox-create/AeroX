

package com.mydev.ecommerce.product.controller;

import com.mydev.ecommerce.category.repository.CategoryRepository;
import com.mydev.ecommerce.common.service.FileStorageService;
import com.mydev.ecommerce.product.dto.ProductRequest;
import com.mydev.ecommerce.product.dto.ProductResponse;
import com.mydev.ecommerce.product.dto.ProductReviewRequest;
import com.mydev.ecommerce.product.dto.ProductReviewResponse;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductImage;
import com.mydev.ecommerce.product.model.ProductReview;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.product.repository.ProductReviewRepository;
import com.mydev.ecommerce.product.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final ProductReviewRepository reviewRepo;
    private final FileStorageService fileStorageService;
    private final ProductService productService;

    public AdminProductController(
            ProductRepository productRepo,
            CategoryRepository categoryRepo,
            ProductReviewRepository reviewRepo,
            FileStorageService fileStorageService,
            ProductService productService
    ) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.reviewRepo = reviewRepo;
        this.fileStorageService = fileStorageService;
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return productService.getAdminProducts(page, size);
    }

    @GetMapping("/{id}")
    public ProductResponse one(@PathVariable Long id) {
        return productService.getAdminProduct(id);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadImage(@RequestPart("file") MultipartFile file) throws IOException {

        FileStorageService.UploadResult uploaded = fileStorageService.saveFile(file);

        return Map.of(
                "imageUrl", uploaded.imageUrl(),
                "publicId", uploaded.publicId(),
                "resourceType", uploaded.resourceType()
        );
    }

    @PostMapping
    @Transactional
    public ProductResponse create(@Valid @RequestBody ProductRequest req) {
        var cat = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        validatePricing(req);

        Product p = new Product();

        p.setTitle(req.title());
        p.setDescription(req.description());

        p.setPriceInr(req.priceInr());
        p.setMrpInr(req.mrpInr());
        p.setDiscountInr(req.discountInr());

        p.setStock(req.stock());

        p.setDisplayOrder(
                req.displayOrder() == null
                        ? getNextDisplayOrder()
                        : req.displayOrder()
        );

        p.setCategory(cat);
        p.setCreatedAt(OffsetDateTime.now());
        p.setActive(true);
        p.setDeleted(false);

        p.setShortHighlights(req.shortHighlights());
        p.setSpecificationsJson(req.specificationsJson());
        p.setFeatureHighlightsJson(req.featureHighlightsJson());
        p.setFaqJson(req.faqJson());
        p.setWarrantyInfo(req.warrantyInfo());
        p.setBoxContentsJson(req.boxContentsJson());
        p.setCompatibility(req.compatibility());
        p.setDemoVideoUrl(req.demoVideoUrl());
        p.setPdpBannersJson(req.pdpBannersJson());

        if (req.images() != null) {
            for (String url : req.images()) {
                ProductImage img = new ProductImage();
                img.setImageUrl(url);
                img.setCloudinaryPublicId(extractPublicId(url));
                img.setProduct(p);
                p.getImages().add(img);
            }
        }

        Product savedProduct = productRepo.saveAndFlush(p);

        return productService.getAdminProduct(savedProduct.getId());
    }

    @PutMapping("/{id}")
    @Transactional
    public ProductResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest req
    ) {
        Product p = productRepo.findAdminByIdWithImages(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        var cat = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        validatePricing(req);

        p.setTitle(req.title());
        p.setDescription(req.description());

        p.setPriceInr(req.priceInr());
        p.setMrpInr(req.mrpInr());
        p.setDiscountInr(req.discountInr());

        p.setStock(req.stock());

        if (req.displayOrder() != null) {
            p.setDisplayOrder(req.displayOrder());
        }

        p.setCategory(cat);

        p.setShortHighlights(req.shortHighlights());
        p.setSpecificationsJson(req.specificationsJson());
        p.setFeatureHighlightsJson(req.featureHighlightsJson());
        p.setFaqJson(req.faqJson());
        p.setWarrantyInfo(req.warrantyInfo());
        p.setBoxContentsJson(req.boxContentsJson());
        p.setCompatibility(req.compatibility());
        p.setDemoVideoUrl(req.demoVideoUrl());
        p.setPdpBannersJson(req.pdpBannersJson());

        Set<String> newImageUrls = req.images() == null
                ? Set.of()
                : new LinkedHashSet<>(req.images());

        for (ProductImage oldImage : p.getImages()) {
            if (!newImageUrls.contains(oldImage.getImageUrl())) {
                fileStorageService.deleteFile(oldImage.getCloudinaryPublicId());
            }
        }

        p.getImages().clear();

        if (req.images() != null) {
            for (String url : req.images()) {
                ProductImage img = new ProductImage();
                img.setImageUrl(url);
                img.setCloudinaryPublicId(extractPublicId(url));
                img.setProduct(p);
                p.getImages().add(img);
            }
        }

        Product savedProduct = productRepo.saveAndFlush(p);

        return productService.getAdminProduct(savedProduct.getId());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void delete(@PathVariable Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        p.setActive(false);
        p.setDeleted(true);

        productRepo.save(p);
    }

    @PostMapping("/{productId}/reviews")
    @Transactional
    public ProductReviewResponse addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReviewRequest req
    ) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductReview review = new ProductReview();

        review.setProduct(product);
        review.setReviewerName(req.reviewerName().trim());
        review.setRating(req.rating());
        review.setReviewText(req.reviewText().trim());
        review.setFeatured(Boolean.TRUE.equals(req.featured()));

        ProductReview savedReview = reviewRepo.save(review);

        return mapReviewToResponse(savedReview);
    }

    @PutMapping("/{productId}/reviews/{reviewId}")
    @Transactional
    public ProductReviewResponse updateReview(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ProductReviewRequest req
    ) {
        ProductReview review = reviewRepo.findByIdAndProductId(reviewId, productId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        review.setReviewerName(req.reviewerName().trim());
        review.setRating(req.rating());
        review.setReviewText(req.reviewText().trim());
        review.setFeatured(Boolean.TRUE.equals(req.featured()));

        ProductReview savedReview = reviewRepo.save(review);

        return mapReviewToResponse(savedReview);
    }

    @DeleteMapping("/{productId}/reviews/{reviewId}")
    @Transactional
    public void deleteReview(
            @PathVariable Long productId,
            @PathVariable Long reviewId
    ) {
        ProductReview review = reviewRepo.findByIdAndProductId(reviewId, productId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        reviewRepo.delete(review);
    }

    private void validatePricing(ProductRequest req) {
        if (req.priceInr() == null || req.priceInr() <= 0) {
            throw new RuntimeException("Final selling price must be greater than 0");
        }

        if (req.mrpInr() == null || req.mrpInr() <= 0) {
            throw new RuntimeException("MRP must be greater than 0");
        }

        if (req.discountInr() == null || req.discountInr() <= 0) {
            throw new RuntimeException("Discounted price must be greater than 0");
        }

        if (req.discountInr() > req.mrpInr()) {
            throw new RuntimeException("Discounted price cannot be greater than MRP");
        }

        if (req.priceInr() > req.discountInr()) {
            throw new RuntimeException("Final selling price cannot be greater than discounted price");
        }
    }

    private ProductReviewResponse mapReviewToResponse(ProductReview review) {
        return new ProductReviewResponse(
                review.getId(),
                review.getReviewerName(),
                review.getRating(),
                review.getReviewText(),
                review.isFeatured()
        );
    }

    private Integer getNextDisplayOrder() {
        Integer maxDisplayOrder = productRepo.findMaxDisplayOrder();
        return maxDisplayOrder == null ? 1 : maxDisplayOrder + 1;
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        int uploadIndex = imageUrl.indexOf("/upload/");

        if (uploadIndex < 0) {
            return null;
        }

        String path = imageUrl.substring(uploadIndex + "/upload/".length());

        path = path.replaceFirst("^v\\d+/", "");

        int lastDot = path.lastIndexOf('.');

        if (lastDot > 0) {
            path = path.substring(0, lastDot);
        }

        return path;
    }
}