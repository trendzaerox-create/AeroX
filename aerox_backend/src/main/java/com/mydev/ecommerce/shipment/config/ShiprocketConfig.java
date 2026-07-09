
// package com.mydev.ecommerce.shipment.config;

// import org.springframework.boot.context.properties.EnableConfigurationProperties;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.scheduling.annotation.EnableScheduling;
// import org.springframework.web.client.RestClient;

// @Configuration
// @EnableScheduling
// @EnableConfigurationProperties(ShiprocketProperties.class)
// public class ShiprocketConfig {

//     @Bean
//     public RestClient shiprocketRestClient(
//             ShiprocketProperties properties
//     ) {
//         String baseUrl =
//                 properties.getBaseUrl() == null
//                         || properties.getBaseUrl().isBlank()
//                         ? "https://apiv2.shiprocket.in"
//                         : properties.getBaseUrl().trim();

//         return RestClient
//                 .builder()
//                 .baseUrl(baseUrl)
//                 .defaultHeader(
//                         HttpHeaders.CONTENT_TYPE,
//                         MediaType.APPLICATION_JSON_VALUE
//                 )
//                 .defaultHeader(
//                         HttpHeaders.ACCEPT,
//                         MediaType.APPLICATION_JSON_VALUE
//                 )
//                 .build();
//     }
// }












package com.mydev.ecommerce.shipment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestClient;

@Configuration
@EnableScheduling
@EnableConfigurationProperties(ShiprocketProperties.class)
public class ShiprocketConfig {

    @Value("${app.shiprocket.connect-timeout-ms:10000}")
    private long connectTimeoutMs;

    @Value("${app.shiprocket.read-timeout-ms:30000}")
    private long readTimeoutMs;

    @Bean
    public RestClient shiprocketRestClient(
            ShiprocketProperties properties
    ) {
        String baseUrl =
                properties.getBaseUrl() == null
                        || properties.getBaseUrl().isBlank()
                        ? "https://apiv2.shiprocket.in"
                        : properties.getBaseUrl().trim();

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                toSafeTimeoutInt(
                        connectTimeoutMs,
                        10000
                )
        );

        requestFactory.setReadTimeout(
                toSafeTimeoutInt(
                        readTimeoutMs,
                        30000
                )
        );

        return RestClient
                .builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    private int toSafeTimeoutInt(
            long value,
            int defaultValue
    ) {
        if (value <= 0) {
            return defaultValue;
        }

        if (value > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }

        return (int) value;
    }
}