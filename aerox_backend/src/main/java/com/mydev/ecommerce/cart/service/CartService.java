

package com.mydev.ecommerce.cart.service;

import com.mydev.ecommerce.cart.dto.AddToCartRequest;
import com.mydev.ecommerce.cart.dto.CartItemResponse;
import com.mydev.ecommerce.cart.dto.CartResponse;
import com.mydev.ecommerce.cart.dto.MergeCartItemRequest;
import com.mydev.ecommerce.cart.dto.MergeCartRequest;
import com.mydev.ecommerce.cart.dto.UpdateCartItemRequest;
import com.mydev.ecommerce.cart.model.Cart;
import com.mydev.ecommerce.cart.model.CartItem;
import com.mydev.ecommerce.cart.repository.CartItemRepository;
import com.mydev.ecommerce.cart.repository.CartRepository;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    /* =========================================
       GET MY CART
    ========================================= */

    public CartResponse getMyCart(
            Principal principal
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        return toResponse(cart);
    }

    /* =========================================
       ADD ITEM
    ========================================= */

    public CartResponse addItem(
            Principal principal,
            AddToCartRequest request
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Product not found"
                                )
                        );

        validateProductSellable(product);

        validateProductPrice(product);

        int requestedQty =
                sanitizeQuantity(
                        request.getQuantity()
                );

        CartItem cartItem =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                product.getId()
                        )
                        .orElse(null);

        if (cartItem == null) {

            if (
                    requestedQty >
                    product.getStock()
            ) {

                throw new IllegalArgumentException(
                        "Requested quantity exceeds available stock"
                );
            }

            CartItem newItem =
                    new CartItem();

            newItem.setCart(cart);

            newItem.setProduct(product);

            newItem.setQuantity(requestedQty);

            newItem.setUnitPriceSnapshot(
                    toBigDecimal(
                            product.getPriceInr()
                    )
            );

            cart.getItems().add(newItem);

        } else {

            int newQty =
                    cartItem.getQuantity() +
                            requestedQty;

            if (
                    newQty >
                    product.getStock()
            ) {

                throw new IllegalArgumentException(
                        "Requested quantity exceeds available stock"
                );
            }

            cartItem.setQuantity(newQty);

            cartItem.setUnitPriceSnapshot(
                    toBigDecimal(
                            product.getPriceInr()
                    )
            );
        }

        Cart saved =
                cartRepository.save(cart);

        return toResponse(saved);
    }

    /* =========================================
       UPDATE ITEM
    ========================================= */

    public CartResponse updateItem(
            Principal principal,
            Long itemId,
            UpdateCartItemRequest request
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        CartItem item =
                cartItemRepository
                        .findById(itemId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Cart item not found"
                                )
                        );

        validateOwnership(cart, item);

        Product product =
                item.getProduct();

        validateProductSellable(product);

        validateProductPrice(product);

        int safeQty =
                sanitizeQuantity(
                        request.getQuantity()
                );

        if (
                safeQty >
                product.getStock()
        ) {

            throw new IllegalArgumentException(
                    "Requested quantity exceeds available stock"
            );
        }

        item.setQuantity(safeQty);

        item.setUnitPriceSnapshot(
                toBigDecimal(
                        product.getPriceInr()
                )
        );

        Cart saved =
                cartRepository.save(cart);

        return toResponse(saved);
    }

    /* =========================================
       REMOVE ITEM
    ========================================= */

    public CartResponse removeItem(
            Principal principal,
            Long itemId
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        CartItem item =
                cartItemRepository
                        .findById(itemId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Cart item not found"
                                )
                        );

        validateOwnership(cart, item);

        cart.getItems().remove(item);

        cartItemRepository.delete(item);

        Cart saved =
                cartRepository.save(cart);

        return toResponse(saved);
    }

    /* =========================================
       CLEAR CART
    ========================================= */

    public CartResponse clearCart(
            Principal principal
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        cart.getItems().clear();

        Cart saved =
                cartRepository.save(cart);

        return toResponse(saved);
    }

    /* =========================================
       MERGE CART
    ========================================= */

    public CartResponse mergeCart(
            Principal principal,
            MergeCartRequest request
    ) {

        User user =
                getUserFromPrincipal(principal);

        Cart cart =
                getOrCreateCart(user);

        if (
                request.getItems() == null ||
                request.getItems().isEmpty()
        ) {

            return toResponse(cart);
        }

        for (
                MergeCartItemRequest incoming
                        : request.getItems()
        ) {

            if (
                    incoming == null ||
                    incoming.getProductId() == null
            ) {
                continue;
            }

            Product product =
                    productRepository
                            .findById(
                                    incoming.getProductId()
                            )
                            .orElse(null);

            if (product == null) {
                continue;
            }

            if (
                    product.getStock() == null ||
                    product.getStock() <= 0
            ) {
                continue;
            }

            if (
                    product.getPriceInr() == null
            ) {
                continue;
            }

            CartItem existing =
                    cartItemRepository
                            .findByCartIdAndProductId(
                                    cart.getId(),
                                    product.getId()
                            )
                            .orElse(null);

            int safeQty =
                    Math.min(
                            sanitizeQuantity(
                                    incoming.getQuantity()
                            ),
                            product.getStock()
                    );

            if (safeQty <= 0) {
                continue;
            }

            if (existing == null) {

                CartItem item =
                        new CartItem();

                item.setCart(cart);

                item.setProduct(product);

                item.setQuantity(safeQty);

                item.setUnitPriceSnapshot(
                        toBigDecimal(
                                product.getPriceInr()
                        )
                );

                cart.getItems().add(item);

            } else {

                int mergedQty =
                        existing.getQuantity() +
                                safeQty;

                mergedQty =
                        Math.min(
                                mergedQty,
                                product.getStock()
                        );

                existing.setQuantity(mergedQty);

                existing.setUnitPriceSnapshot(
                        toBigDecimal(
                                product.getPriceInr()
                        )
                );
            }
        }

        Cart saved =
                cartRepository.save(cart);

        return toResponse(saved);
    }

    /* =========================================
       GET USER
    ========================================= */

    private User getUserFromPrincipal(
            Principal principal
    ) {

        if (
                principal == null ||
                principal.getName() == null ||
                principal.getName().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Unauthorized"
            );
        }

        String email =
                principal.getName()
                        .trim()
                        .toLowerCase();

        log.info(
                "CART AUTH EMAIL = {}",
                email
        );

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "User not found"
                        )
                );
    }

    /* =========================================
       GET OR CREATE CART
    ========================================= */

    private Cart getOrCreateCart(
            User user
    ) {

        return cartRepository
                .findByUserIdWithItems(user.getId())
                .orElseGet(() -> {

                    Cart cart =
                            new Cart();

                    cart.setUser(user);

                    return cartRepository.save(cart);
                });
    }

    /* =========================================
       OWNERSHIP
    ========================================= */

    private void validateOwnership(
            Cart cart,
            CartItem item
    ) {

        if (
                !item.getCart()
                        .getId()
                        .equals(cart.getId())
        ) {

            throw new IllegalArgumentException(
                    "Cart item does not belong to this user"
            );
        }
    }

    /* =========================================
       PRODUCT VALIDATION
    ========================================= */

    private void validateProductSellable(
            Product product
    ) {

        if (
                product.getStock() == null ||
                product.getStock() <= 0
        ) {

            throw new IllegalArgumentException(
                    "Product is out of stock"
            );
        }
    }

    private void validateProductPrice(
            Product product
    ) {

        if (
                product.getPriceInr() == null
        ) {

            throw new IllegalArgumentException(
                    "Product price is missing"
            );
        }
    }

    /* =========================================
       RESPONSE
    ========================================= */

    private CartResponse toResponse(
            Cart cart
    ) {

        List<CartItemResponse> items =
                new ArrayList<>();

        BigDecimal subtotal =
                BigDecimal.ZERO;

        int totalItems = 0;

        for (
                CartItem item
                        : cart.getItems()
        ) {

            Product product =
                    item.getProduct();

            BigDecimal price =
                    item.getUnitPriceSnapshot();

            BigDecimal lineTotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    item.getQuantity()
                            )
                    );

            subtotal =
                    subtotal.add(lineTotal);

            totalItems +=
                    item.getQuantity();

            List<String> imageUrls =
                    product.getImages() == null
                            ? List.of()
                            : product.getImages()
                            .stream()
                            .map(img ->
                                    img.getImageUrl()
                            )
                            .toList();

            items.add(
                    CartItemResponse.builder()

                            .itemId(
                                    item.getId()
                            )

                            .productId(
                                    product.getId()
                            )

                            .title(
                                    product.getTitle()
                            )

                            .unitPrice(price)

                            .quantity(
                                    item.getQuantity()
                            )

                            .lineTotal(lineTotal)

                            .stock(
                                    product.getStock()
                            )

                            .images(imageUrls)

                            .build()
            );
        }

        return CartResponse.builder()

                .cartId(cart.getId())

                .items(items)

                .totalItems(totalItems)

                .subtotal(subtotal)

                .build();
    }

    /* =========================================
       HELPERS
    ========================================= */

    private int sanitizeQuantity(
            Integer quantity
    ) {

        if (quantity == null) {
            return 1;
        }

        return Math.max(quantity, 1);
    }

    private BigDecimal toBigDecimal(
            Object value
    ) {

        if (value == null) {

            throw new IllegalArgumentException(
                    "Price value cannot be null"
            );
        }

        if (value instanceof BigDecimal bd) {
            return bd;
        }

        if (value instanceof Integer i) {
            return BigDecimal.valueOf(i);
        }

        if (value instanceof Long l) {
            return BigDecimal.valueOf(l);
        }

        if (value instanceof Double d) {
            return BigDecimal.valueOf(d);
        }

        return new BigDecimal(
                value.toString()
        );
    }
}