package com.mydev.ecommerce.instagram.config;

import com.mydev.ecommerce.instagram.service.InstagramMediaService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InstagramWarmupConfig {

    @Bean
    public ApplicationRunner instagramWarmupRunner(InstagramMediaService instagramMediaService) {
        return args -> {
            try {
                instagramMediaService.refreshCacheNow();
                System.out.println("Instagram cache warmed on startup.");
            } catch (Exception e) {
                System.err.println("Instagram cache warmup failed: " + e.getMessage());
            }
        };
    }
}