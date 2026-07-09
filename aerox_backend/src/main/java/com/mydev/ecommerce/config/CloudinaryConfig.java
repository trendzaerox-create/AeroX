// package com.mydev.ecommerce.config;

// import com.cloudinary.Cloudinary;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.util.HashMap;
// import java.util.Map;

// @Configuration
// public class CloudinaryConfig {

//     @Value("${cloudinary.cloud-name}")
//     private String cloudName;

//     @Value("${cloudinary.api-key}")
//     private String apiKey;

//     @Value("${cloudinary.api-secret}")
//     private String apiSecret;

//     @Bean
//     public Cloudinary cloudinary() {
//         Map<String, String> config = new HashMap<>();
//         config.put("cloud_name", cloudName);
//         config.put("api_key", apiKey);
//         config.put("api_secret", apiSecret);
//         config.put("secure", "true");
//         return new Cloudinary(config);
//     }
// }


















package com.mydev.ecommerce.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {

        System.out.println("========== CLOUDINARY DEBUG ==========");
        System.out.println("cloudName = [" + cloudName + "]");
        System.out.println("apiKey = [" + apiKey + "]");
        System.out.println("apiSecret exists = " + (apiSecret != null && !apiSecret.isBlank()));
        System.out.println("======================================");

        if (cloudName == null || cloudName.isBlank() || cloudName.equals("cloud_name")) {
            throw new RuntimeException("Invalid Cloudinary cloud name: " + cloudName);
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Cloudinary API key missing");
        }

        if (apiSecret == null || apiSecret.isBlank()) {
            throw new RuntimeException("Cloudinary API secret missing");
        }

        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", true);

        return new Cloudinary(config);
    }
}