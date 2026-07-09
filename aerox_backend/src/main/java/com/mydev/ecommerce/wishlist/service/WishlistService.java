package com.mydev.ecommerce.wishlist.service;

import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductImage;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import com.mydev.ecommerce.wishlist.dto.WishlistItemResponse;
import com.mydev.ecommerce.wishlist.model.Wishlist;
import com.mydev.ecommerce.wishlist.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public WishlistService(
            WishlistRepository wishlistRepo,
            UserRepository userRepo,
            ProductRepository productRepo
    ) {
        this.wishlistRepo = wishlistRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<WishlistItemResponse> getMyWishlist() {
        User user = getCurrentUser();

        return wishlistRepo
                .findByUserIdWithProduct(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<WishlistItemResponse> addToWishlist(Long productId) {
        User user = getCurrentUser();

        Product product = productRepo.findByIdWithImages(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean exists = wishlistRepo.existsByUserIdAndProductId(
                user.getId(),
                productId
        );

        if (!exists) {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepo.save(wishlist);
        }

        return getMyWishlist();
    }

    @Transactional
    public List<WishlistItemResponse> removeFromWishlist(Long productId) {
        User user = getCurrentUser();

        wishlistRepo.deleteByUserIdAndProductId(
                user.getId(),
                productId
        );

        return getMyWishlist();
    }

    public boolean checkWishlist(Long productId) {
        User user = getCurrentUser();

        return wishlistRepo.existsByUserIdAndProductId(
                user.getId(),
                productId
        );
    }

    private WishlistItemResponse toResponse(Wishlist wishlist) {
        Product product = wishlist.getProduct();

        List<String> images = product.getImages() == null
                ? List.of()
                : product.getImages()
                        .stream()
                        .map(ProductImage::getImageUrl)
                        .toList();

        return new WishlistItemResponse(
                wishlist.getId(),
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPriceInr(),
                product.getMrpInr(),
                product.getStock(),
                product.getDiscountPercent(),
                images
        );
    }
}