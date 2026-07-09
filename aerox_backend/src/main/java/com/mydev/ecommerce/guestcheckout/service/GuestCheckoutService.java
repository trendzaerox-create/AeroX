


package com.mydev.ecommerce.guestcheckout.service;

import com.mydev.ecommerce.auth.security.JwtService;
import com.mydev.ecommerce.cart.model.Cart;
import com.mydev.ecommerce.cart.model.CartItem;
import com.mydev.ecommerce.cart.repository.CartRepository;
import com.mydev.ecommerce.guestcheckout.dto.EmailCheckResponse;
import com.mydev.ecommerce.guestcheckout.dto.GuestAuthRequest;
import com.mydev.ecommerce.guestcheckout.dto.GuestAuthResponse;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.repository.ProductRepository;
import com.mydev.ecommerce.user.model.User;
import com.mydev.ecommerce.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GuestCheckoutService {

    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    private final ProductRepository productRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    /* =========================================
       CHECK EMAIL
    ========================================= */

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(
            String email
    ) {

        String normalizedEmail =
                normalizeEmail(email);

        boolean exists =
                userRepository
                        .findByEmail(normalizedEmail)
                        .isPresent();

        return new EmailCheckResponse(exists);
    }

    /* =========================================
       LOGIN / REGISTER DURING CHECKOUT
    ========================================= */

    public GuestAuthResponse continueAsGuestOrCustomer(
            GuestAuthRequest request
    ) {

        String email =
                normalizeEmail(
                        request.email()
                );

        User user;

        boolean existingUser;

        var existingUserOptional =
                userRepository.findByEmail(email);

        /* =====================================
           EXISTING USER LOGIN
        ===================================== */

        if (existingUserOptional.isPresent()) {

            user =
                    existingUserOptional.get();

            existingUser = true;

            validatePassword(request);

            if (
                    !passwordEncoder.matches(
                            request.password(),
                            user.getPasswordHash()
                    )
            ) {

                throw new RuntimeException(
                        "Invalid password"
                );
            }

            log.info(
                    "CHECKOUT LOGIN SUCCESS -> {}",
                    email
            );
        }

        /* =====================================
           NEW USER REGISTER
        ===================================== */

        else {

            validateRegistrationRequest(request);

            user = new User();

            user.setName(
                    resolveName(
                            request.name(),
                            email
                    )
            );

            user.setEmail(email);

            user.setPhone(
                    request.phone()
                            .trim()
            );

            user.setPasswordHash(
                    passwordEncoder.encode(
                            request.password()
                    )
            );

            user.setRole("CUSTOMER");

            user.setCreatedAt(
                    OffsetDateTime.now()
            );

            user =
                    userRepository.save(user);

            existingUser = false;

            log.info(
                    "CHECKOUT REGISTER SUCCESS -> {}",
                    email
            );
        }

        /* =====================================
           CART
        ===================================== */

        Cart cart =
                cartRepository
                        .findByUserId(user.getId())
                        .orElse(null);

        if (cart == null) {

            cart = createCart(user);
        }

        mergeGuestItemsIntoCart(
                cart,
                request
        );

        /* =====================================
           JWT
        ===================================== */

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        return new GuestAuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                existingUser
        );
    }

    /* =========================================
       CREATE CART
    ========================================= */

    private Cart createCart(
            User user
    ) {

        Cart cart = new Cart();

        cart.setUser(user);

        return cartRepository.save(cart);
    }

    /* =========================================
       MERGE GUEST CART
    ========================================= */

    private void mergeGuestItemsIntoCart(
            Cart cart,
            GuestAuthRequest request
    ) {

        if (
                request.items() == null ||
                request.items().isEmpty()
        ) {

            return;
        }

        if (cart.getItems() == null) {

            throw new RuntimeException(
                    "Cart items list is not initialized. Initialize with new ArrayList<> in Cart entity."
            );
        }

        for (var guestItem : request.items()) {

            if (
                    guestItem == null ||
                    guestItem.productId() == null ||
                    guestItem.quantity() <= 0
            ) {

                continue;
            }

            Product product =
                    productRepository
                            .findById(
                                    guestItem.productId()
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

            int safeQty =
                    Math.min(
                            guestItem.quantity(),
                            product.getStock()
                    );

            if (safeQty <= 0) {
                continue;
            }

            CartItem existingItem =
                    cart.getItems()
                            .stream()
                            .filter(item ->
                                    item.getProduct() != null &&
                                    item.getProduct()
                                            .getId()
                                            .equals(product.getId())
                            )
                            .findFirst()
                            .orElse(null);

            BigDecimal unitPrice =
                    BigDecimal.valueOf(
                            product.getPriceInr()
                    );

            if (existingItem != null) {

                int mergedQty =
                        existingItem.getQuantity() +
                                safeQty;

                mergedQty =
                        Math.min(
                                mergedQty,
                                product.getStock()
                        );

                existingItem.setQuantity(
                        mergedQty
                );

                existingItem.setUnitPriceSnapshot(
                        unitPrice
                );

            } else {

                CartItem cartItem =
                        new CartItem();

                cartItem.setCart(cart);

                cartItem.setProduct(product);

                cartItem.setQuantity(safeQty);

                cartItem.setUnitPriceSnapshot(
                        unitPrice
                );

                cart.getItems().add(cartItem);
            }
        }

        cartRepository.save(cart);
    }

    /* =========================================
       VALIDATION
    ========================================= */

    private void validatePassword(
            GuestAuthRequest request
    ) {

        if (
                request.password() == null ||
                request.password().isBlank()
        ) {

            throw new RuntimeException(
                    "Password is required"
            );
        }
    }

    private void validateRegistrationRequest(
            GuestAuthRequest request
    ) {

        if (
                request.password() == null ||
                request.password().length() < 6
        ) {

            throw new RuntimeException(
                    "Password must be at least 6 characters"
            );
        }

        if (
                request.phone() == null ||
                request.phone().isBlank()
        ) {

            throw new RuntimeException(
                    "Phone number is required"
            );
        }

        if (
                request.phone().trim().length() < 10
        ) {

            throw new RuntimeException(
                    "Invalid phone number"
            );
        }
    }

    /* =========================================
       NORMALIZE EMAIL
    ========================================= */

    private String normalizeEmail(
            String email
    ) {

        if (
                email == null ||
                email.isBlank()
        ) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    /* =========================================
       RESOLVE NAME
    ========================================= */

    private String resolveName(
            String name,
            String email
    ) {

        if (
                name != null &&
                !name.isBlank()
        ) {

            return name.trim();
        }

        return email.split("@")[0];
    }
}