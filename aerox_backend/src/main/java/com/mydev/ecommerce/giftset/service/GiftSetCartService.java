

package com.mydev.ecommerce.giftset.service;

import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.giftbox.service.GiftBoxService;
import com.mydev.ecommerce.giftset.dto.AddGiftSetCartItemRequest;
import com.mydev.ecommerce.giftset.dto.GiftSetCartResponse;
import com.mydev.ecommerce.giftset.dto.GiftSetItemResponse;
import com.mydev.ecommerce.giftset.dto.GiftSetSummaryResponse;
import com.mydev.ecommerce.giftset.model.GiftSetCart;
import com.mydev.ecommerce.giftset.model.GiftSetCartItem;
import com.mydev.ecommerce.giftset.repository.GiftSetCartItemRepository;
import com.mydev.ecommerce.giftset.repository.GiftSetCartRepository;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.model.ProductImage;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GiftSetCartService {

    private static final int MAX_GIFT_SET_ITEMS = 5;

    private final GiftSetCartRepository giftSetCartRepository;
    private final GiftSetCartItemRepository giftSetCartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final GiftBoxService giftBoxService;

    public GiftSetCartResponse getMyCart(Principal principal) {
        User user = getUserFromPrincipal(principal);
        GiftSetCart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    public GiftSetCartResponse addItem(Principal principal, AddGiftSetCartItemRequest request) {
        User user = getUserFromPrincipal(principal);
        GiftSetCart cart = getOrCreateCart(user);

        validateAddRequest(request, cart);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        validateProductSellable(product);
        validateProductPrice(product);

        GiftBox giftBox = giftBoxService.getActiveGiftBoxEntity(request.getGiftBoxId());
        validateGiftBoxSellable(giftBox);
        validateGiftBoxPrice(giftBox);

        GiftSetCartItem item = new GiftSetCartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setGiftBox(giftBox);
        item.setProductPriceSnapshot(product.getPriceInr());
        item.setGiftBoxPriceSnapshot(giftBox.getPriceInr());

        cart.getItems().add(item);

        GiftSetCart saved = giftSetCartRepository.save(cart);
        GiftSetCart hydrated = giftSetCartRepository.findByUserIdWithItems(user.getId())
                .orElse(saved);

        return toResponse(hydrated);
    }

    public GiftSetCartResponse removeItem(Principal principal, Long itemId) {
        User user = getUserFromPrincipal(principal);
        GiftSetCart cart = getOrCreateCart(user);

        GiftSetCartItem item = giftSetCartItemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Gift set cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Gift set cart item does not belong to this user");
        }

        cart.getItems().remove(item);
        giftSetCartItemRepository.delete(item);

        GiftSetCart saved = giftSetCartRepository.save(cart);
        GiftSetCart hydrated = giftSetCartRepository.findByUserIdWithItems(user.getId())
                .orElse(saved);

        return toResponse(hydrated);
    }

    public GiftSetCartResponse clearCart(Principal principal) {
        User user = getUserFromPrincipal(principal);
        GiftSetCart cart = getOrCreateCart(user);

        cart.getItems().clear();

        GiftSetCart saved = giftSetCartRepository.save(cart);
        GiftSetCart hydrated = giftSetCartRepository.findByUserIdWithItems(user.getId())
                .orElse(saved);

        return toResponse(hydrated);
    }

    private void validateAddRequest(AddGiftSetCartItemRequest request, GiftSetCart cart) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (request.getProductId() == null) {
            throw new IllegalArgumentException("Product id is required");
        }
        if (request.getGiftBoxId() == null) {
            throw new IllegalArgumentException("Gift box id is required");
        }

        long currentCount = giftSetCartItemRepository.countByCartId(cart.getId());
        if (currentCount >= MAX_GIFT_SET_ITEMS) {
            throw new IllegalArgumentException("Maximum 5 products allowed in gift set");
        }

        boolean alreadyExists = giftSetCartItemRepository
                .findByCartIdAndProductId(cart.getId(), request.getProductId())
                .isPresent();

        if (alreadyExists) {
            throw new IllegalArgumentException("Duplicate products are not allowed in a gift set");
        }
    }

    private User getUserFromPrincipal(Principal principal) {
        if (principal == null || principal.getName() == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private GiftSetCart getOrCreateCart(User user) {
        return giftSetCartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> {
                    GiftSetCart cart = new GiftSetCart();
                    cart.setUser(user);
                    return giftSetCartRepository.save(cart);
                });
    }

    private void validateProductSellable(Product product) {
        if (product.isDeleted() || !product.isActive()) {
            throw new IllegalArgumentException("Product is not available");
        }
        if (product.getStock() == null || product.getStock() <= 0) {
            throw new IllegalArgumentException("Product is out of stock");
        }
    }

    private void validateProductPrice(Product product) {
        if (product.getPriceInr() == null) {
            throw new IllegalArgumentException("Product price is missing");
        }
    }

    private void validateGiftBoxSellable(GiftBox giftBox) {
        if (giftBox.getStock() == null || giftBox.getStock() <= 0) {
            throw new IllegalArgumentException("Gift box is out of stock");
        }
    }

    private void validateGiftBoxPrice(GiftBox giftBox) {
        if (giftBox.getPriceInr() == null) {
            throw new IllegalArgumentException("Gift box price is missing");
        }
    }

    private GiftSetCartResponse toResponse(GiftSetCart cart) {
        List<GiftSetItemResponse> itemResponses = new ArrayList<>();
        int subtotal = 0;

        for (GiftSetCartItem item : cart.getItems()) {
            int productPrice = item.getProductPriceSnapshot();
            int giftBoxPrice = item.getGiftBoxPriceSnapshot();
            int lineTotal = productPrice + giftBoxPrice;

            subtotal += lineTotal;

            itemResponses.add(
                    GiftSetItemResponse.builder()
                            .cartItemId(item.getId())
                            .productId(item.getProduct().getId())
                            .productTitle(item.getProduct().getTitle())
                            .productPriceInr(productPrice)
                            .productImagePath(getProductImagePath(item.getProduct()))
                            .giftBoxId(item.getGiftBox().getId())
                            .giftBoxName(item.getGiftBox().getName())
                            .giftBoxPriceInr(giftBoxPrice)
                            .giftBoxImagePath(item.getGiftBox().getImagePath())
                            .lineTotalInr(lineTotal)
                            .build()
            );
        }

        int totalProducts = itemResponses.size();
        int discountPercent = getDiscountPercent(totalProducts);
        int discountAmount = Math.round(subtotal * (discountPercent / 100.0f));
        int finalTotal = subtotal - discountAmount;

        GiftSetSummaryResponse summary = GiftSetSummaryResponse.builder()
                .items(itemResponses)
                .totalProducts(totalProducts)
                .subtotalInr(subtotal)
                .discountPercent(discountPercent)
                .discountAmountInr(discountAmount)
                .finalTotalInr(finalTotal)
                .build();

        return GiftSetCartResponse.builder()
                .cartId(cart.getId())
                .summary(summary)
                .build();
    }

    private String getProductImagePath(Product product) {
        if (product == null || product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }

        ProductImage firstImage = product.getImages().get(0);
        return firstImage != null ? firstImage.getImageUrl() : null;
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
}
















