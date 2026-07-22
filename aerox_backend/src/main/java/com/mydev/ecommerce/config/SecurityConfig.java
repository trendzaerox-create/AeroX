
package com.mydev.ecommerce.config;

import com.mydev.ecommerce.auth.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthFilter jwtAuthFilter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        .requestMatchers(
                                "/",
                                "/ping",
                                "/warmup",
                                "/ping-test",
                                "/error"
                        ).permitAll()

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/guest-checkout/**").permitAll()

                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/brand-showcases/**").permitAll()
                        .requestMatchers("/api/hero-sections/**").permitAll()
                        .requestMatchers("/api/gift-boxes/**").permitAll()
                        .requestMatchers("/api/giftsets/**").permitAll()
                        .requestMatchers("/api/instagram/**").permitAll()

                        /*
                         * Razorpay Webhook
                         *
                         * Razorpay calls this endpoint from its server without
                         * sending the customer's JWT token.
                         *
                         * Security is handled using the X-Razorpay-Signature
                         * header inside RazorpayWebhookController / PaymentService.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/payments/razorpay/webhook"
                        ).permitAll()

                        /*
                         * Shiprocket Tracking Webhook
                         *
                         * Shiprocket calls this endpoint from its server without
                         * sending a customer or admin JWT token.
                         *
                         * Security is handled using the x-api-key header inside
                         * ShiprocketWebhookController / ShiprocketService.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/shipment-events/tracking"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/newsletter/subscribe"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/bulk-orders"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/bulk-orders/**"
                        ).hasRole("ADMIN")

                        /*
                         * Instagram Admin
                         *
                         * These endpoints are permitted by Spring Security,
                         * but are protected using X-Admin-Refresh-Secret
                         * inside InstagramAdminController.
                         */
                        .requestMatchers(
                                "/api/admin/instagram/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/gift-boxes/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/hero-sections/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/addresses/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/orders/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/cart/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/giftset-cart/**"
                        ).authenticated()

                        /*
                         * Razorpay create-order and verify endpoints remain
                         * authenticated through the rule below.
                         */

                        .requestMatchers(
                                "/api/wishlist/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/user/**"
                        ).hasAnyRole("CUSTOMER", "ADMIN")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}