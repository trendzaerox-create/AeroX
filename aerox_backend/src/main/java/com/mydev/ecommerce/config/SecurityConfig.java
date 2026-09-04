// package com.mydev.ecommerce.config;

// import com.mydev.ecommerce.auth.security.JwtAuthFilter;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain filterChain(
//             HttpSecurity http,
//             JwtAuthFilter jwtAuthFilter
//     ) throws Exception {

//         http
//                 .csrf(csrf -> csrf.disable())

//                 .cors(cors -> {
//                     // Uses your configured CorsConfigurationSource
//                     // or WebMvcConfigurer CORS configuration.
//                 })

//                 .sessionManagement(sessionManagement ->
//                         sessionManagement.sessionCreationPolicy(
//                                 SessionCreationPolicy.STATELESS
//                         )
//                 )

//                 .httpBasic(httpBasic -> httpBasic.disable())
//                 .formLogin(formLogin -> formLogin.disable())

//                 .authorizeHttpRequests(auth -> auth

//                         /*
//                          * Allow browser CORS preflight requests.
//                          */
//                         .requestMatchers(
//                                 HttpMethod.OPTIONS,
//                                 "/**"
//                         ).permitAll()

//                         /*
//                          * Public health and utility endpoints.
//                          */
//                         .requestMatchers(
//                                 "/",
//                                 "/ping",
//                                 "/warmup",
//                                 "/ping-test",
//                                 "/error"
//                         ).permitAll()

//                         /*
//                          * Public static files.
//                          *
//                          * /uploads/** is required for locally stored product,
//                          * category, banner and other uploaded images.
//                          */
//                         .requestMatchers(
//                                 "/images/**",
//                                 "/uploads/**"
//                         ).permitAll()

//                         /*
//                          * Authentication and guest checkout.
//                          */
//                         .requestMatchers(
//                                 "/api/auth/**",
//                                 "/api/guest-checkout/**"
//                         ).permitAll()

//                         /*
//                          * Public storefront endpoints.
//                          */
//                         .requestMatchers(
//                                 "/api/products/**",
//                                 "/api/categories/**",
//                                 "/api/brand-showcases/**",
//                                 "/api/hero-sections/**",
//                                 "/api/gift-boxes/**",
//                                 "/api/giftsets/**",
//                                 "/api/instagram/**"
//                         ).permitAll()

//                         /*
//                          * Razorpay Webhook
//                          *
//                          * Razorpay calls this endpoint without a customer JWT.
//                          * Security is handled using X-Razorpay-Signature inside
//                          * RazorpayWebhookController / PaymentService.
//                          */
//                         .requestMatchers(
//                                 HttpMethod.POST,
//                                 "/api/payments/razorpay/webhook"
//                         ).permitAll()

//                         /*
//                          * Shiprocket Tracking Webhook
//                          *
//                          * Shiprocket calls this endpoint without a customer JWT.
//                          * Security is handled using the x-api-key header inside
//                          * ShiprocketWebhookController / ShiprocketService.
//                          */
//                         .requestMatchers(
//                                 HttpMethod.POST,
//                                 "/api/shipment-events/tracking"
//                         ).permitAll()

//                         /*
//                          * Public form submission endpoints.
//                          */
//                         .requestMatchers(
//                                 HttpMethod.POST,
//                                 "/api/newsletter/subscribe",
//                                 "/api/bulk-orders"
//                         ).permitAll()

//                         /*
//                          * Instagram administration.
//                          *
//                          * These endpoints are permitted by Spring Security but
//                          * must remain protected using X-Admin-Refresh-Secret
//                          * inside InstagramAdminController.
//                          */
//                         .requestMatchers(
//                                 "/api/admin/instagram/**"
//                         ).permitAll()

//                         /*
//                          * Administrator-only endpoints.
//                          *
//                          * Keep the more specific admin rules before
//                          * the general /api/admin/** rule.
//                          */
//                         .requestMatchers(
//                                 "/api/admin/bulk-orders/**",
//                                 "/api/admin/gift-boxes/**",
//                                 "/api/admin/hero-sections/**"
//                         ).hasRole("ADMIN")

//                         .requestMatchers(
//                                 "/api/admin/**"
//                         ).hasRole("ADMIN")

//                         /*
//                          * Authenticated customer endpoints.
//                          */
//                         .requestMatchers(
//                                 "/api/addresses/**",
//                                 "/api/orders/**",
//                                 "/api/cart/**",
//                                 "/api/giftset-cart/**",
//                                 "/api/wishlist/**"
//                         ).authenticated()

//                         /*
//                          * Customer or administrator endpoints.
//                          */
//                         .requestMatchers(
//                                 "/api/user/**"
//                         ).hasAnyRole("CUSTOMER", "ADMIN")

//                         /*
//                          * Any endpoint not explicitly declared above
//                          * requires authentication.
//                          */
//                         .anyRequest().authenticated()
//                 )

//                 .addFilterBefore(
//                         jwtAuthFilter,
//                         UsernamePasswordAuthenticationFilter.class
//                 );

//         return http.build();
//     }
// }

















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
                    // Uses your configured CorsConfigurationSource
                    // or WebMvcConfigurer CORS configuration.
                })

                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Allow browser CORS preflight requests.
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        /*
                         * Public health and utility endpoints.
                         */
                        .requestMatchers(
                                "/",
                                "/ping",
                                "/warmup",
                                "/ping-test",
                                "/error"
                        ).permitAll()

                        /*
                         * Public static files.
                         *
                         * /uploads/** is required for locally stored product,
                         * category, banner and other uploaded images.
                         */
                        .requestMatchers(
                                "/images/**",
                                "/uploads/**"
                        ).permitAll()

                        /*
                         * Authentication and guest checkout.
                         */
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/guest-checkout/**"
                        ).permitAll()

                        /*
                         * Public storefront endpoints.
                         */
                        .requestMatchers(
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/brand-showcases/**",
                                "/api/hero-sections/**",
                                "/api/gift-boxes/**",
                                "/api/giftsets/**",
                                "/api/instagram/**"
                        ).permitAll()


                        /*
                         * Public Razorpay Magic Checkout endpoints.
                         * Guest checkout has no JWT. /verify is protected by the
                         * Razorpay checkout signature and server-side payment fetch;
                         * /shipping-info is called by Razorpay servers.
                         */
                        .requestMatchers(
                                "/api/payments/razorpay/magic/**"
                        ).permitAll()

                        /*
                         * Razorpay Webhook
                         *
                         * Razorpay calls this endpoint without a customer JWT.
                         * Security is handled using X-Razorpay-Signature inside
                         * RazorpayWebhookController / PaymentService.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/payments/razorpay/webhook"
                        ).permitAll()

                        /*
                         * Shiprocket Tracking Webhook
                         *
                         * Shiprocket calls this endpoint without a customer JWT.
                         * Security is handled using the x-api-key header inside
                         * ShiprocketWebhookController / ShiprocketService.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/shipment-events/tracking"
                        ).permitAll()

                        /*
                         * Public form submission endpoints.
                         */
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/newsletter/subscribe",
                                "/api/bulk-orders"
                        ).permitAll()

                        /*
                         * Instagram administration.
                         *
                         * These endpoints are permitted by Spring Security but
                         * must remain protected using X-Admin-Refresh-Secret
                         * inside InstagramAdminController.
                         */
                        .requestMatchers(
                                "/api/admin/instagram/**"
                        ).permitAll()

                        /*
                         * Administrator-only endpoints.
                         *
                         * Keep the more specific admin rules before
                         * the general /api/admin/** rule.
                         */
                        .requestMatchers(
                                "/api/admin/bulk-orders/**",
                                "/api/admin/gift-boxes/**",
                                "/api/admin/hero-sections/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        /*
                         * Authenticated customer endpoints.
                         */
                        .requestMatchers(
                                "/api/addresses/**",
                                "/api/orders/**",
                                "/api/cart/**",
                                "/api/giftset-cart/**",
                                "/api/wishlist/**"
                        ).authenticated()

                        /*
                         * Customer or administrator endpoints.
                         */
                        .requestMatchers(
                                "/api/user/**"
                        ).hasAnyRole("CUSTOMER", "ADMIN")

                        /*
                         * Any endpoint not explicitly declared above
                         * requires authentication.
                         */
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
