package com.mydev.ecommerce.shipment.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.client.RestClient;

import java.net.URI;

@Configuration
@EnableScheduling
@EnableMethodSecurity
@EnableConfigurationProperties(ShiprocketProperties.class)
public class ShiprocketConfig {

    @Bean(name = "shiprocketRestClient")
    public RestClient shiprocketRestClient(
            ShiprocketProperties properties
    ) {
        String baseUrl = resolveBaseUrl(properties);

        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                toSafeTimeoutInt(
                        properties.getConnectTimeoutMs(),
                        10000
                )
        );

        requestFactory.setReadTimeout(
                toSafeTimeoutInt(
                        properties.getReadTimeoutMs(),
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
                .defaultHeader(
                        HttpHeaders.USER_AGENT,
                        "Trendz-AeroX-Shiprocket/1.0"
                )
                .build();
    }

    private String resolveBaseUrl(
            ShiprocketProperties properties
    ) {
        String configured = properties.getBaseUrl();

        String baseUrl =
                configured == null || configured.isBlank()
                        ? "https://apiv2.shiprocket.in"
                        : configured.trim();

        URI uri;

        try {
            uri = URI.create(baseUrl);

        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "app.shiprocket.base-url is invalid",
                    exception
            );
        }

        if (
                uri.getScheme() == null
                        || uri.getHost() == null
                        || !(
                        "http".equalsIgnoreCase(uri.getScheme())
                                || "https".equalsIgnoreCase(uri.getScheme())
                )
        ) {
            throw new IllegalStateException(
                    "app.shiprocket.base-url must be a valid HTTP(S) URL"
            );
        }

        if (
                properties.isEnabled()
                        && !"https".equalsIgnoreCase(uri.getScheme())
        ) {
            throw new IllegalStateException(
                    "Shiprocket production base URL must use HTTPS"
            );
        }

        while (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }

        return baseUrl;
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
