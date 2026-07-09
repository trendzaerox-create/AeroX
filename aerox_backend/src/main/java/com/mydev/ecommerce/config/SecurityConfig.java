


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
                .cors(cors -> {})
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

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
                         * Razorpay calls this endpoint from its server.
                         * It will NOT send your JWT token.
                         * Security is handled by X-Razorpay-Signature
                         * verification inside RazorpayWebhookController / PaymentService.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/payments/razorpay/webhook"
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
                         * These are allowed by Spring Security,
                         * but still protected by X-Admin-Refresh-Secret
                         * inside InstagramAdminController.
                         */
                        .requestMatchers(
                                "/api/admin/instagram/**"
                        ).permitAll()

                        .requestMatchers("/api/admin/gift-boxes/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/hero-sections/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/api/addresses/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/giftset-cart/**").authenticated()

                        /*
                         * Razorpay create-order and verify should stay authenticated.
                         * They are protected by .anyRequest().authenticated().
                         */

                        .requestMatchers("/api/wishlist/**").authenticated()

                        .requestMatchers("/api/user/**").hasAnyRole("CUSTOMER", "ADMIN")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}