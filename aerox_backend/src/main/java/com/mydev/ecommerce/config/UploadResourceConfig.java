package com.mydev.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

@Configuration
public class UploadResourceConfig implements WebMvcConfigurer {

    private final Path uploadDirectory;

    public UploadResourceConfig(
            @Value("${UPLOAD_DIR:/app/uploads}")
            String uploadDirectory
    ) {
        this.uploadDirectory = Paths
                .get(uploadDirectory)
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        String resourceLocation =
                uploadDirectory.toUri().toString();

        if (!resourceLocation.endsWith("/")) {
            resourceLocation += "/";
        }

        System.out.println(
                "Serving uploaded files from: "
                        + resourceLocation
        );

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation)
                .setCacheControl(
                        CacheControl
                                .maxAge(Duration.ofDays(30))
                                .cachePublic()
                );
    }
}