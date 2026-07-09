package com.mydev.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class CorsConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration cfg = new CorsConfiguration();

    cfg.setAllowedOriginPatterns(List.of(
        "http://localhost:3000",
        "https://trendz-firenze-frontend.vercel.app",
        "https://*.vercel.app",
        "https://trendzaerox.com",
        "https://www.trendzaerox.com"
    ));

    cfg.setAllowedMethods(List.of(
        "GET","POST","PUT","PATCH","DELETE","OPTIONS"
    ));

    cfg.setAllowedHeaders(List.of("*"));
    cfg.setExposedHeaders(List.of("Authorization"));
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", cfg);

    return source;
  }
}