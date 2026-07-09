package com.mydev.ecommerce.whatsapp.service;

import com.mydev.ecommerce.order.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class WhatsAppService {

    private final RestClient restClient = RestClient.create();

    @Value("${app.whatsapp.enabled:false}")
    private boolean enabled;

    @Value("${app.whatsapp.access-token:}")
    private String accessToken;

    @Value("${app.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${app.whatsapp.template-name:order_confirmation}")
    private String templateName;

    @Value("${app.whatsapp.language-code:en}")
    private String languageCode;

    public void sendOrderPlacedMessage(Order order) {
        String phone = normalizeIndiaPhone(order.getAddressPhone());

        log.info("🔥 WHATSAPP FLOW START -> enabled={}, phone={}, order={}",
                enabled, phone, order.getOrderNumber());

        if (!enabled) {
            log.warn("❌ WhatsApp disabled. Skipping message.");
            return;
        }

        if (phone == null || phone.isBlank()) {
            log.warn("❌ Invalid WhatsApp phone number: {}", order.getAddressPhone());
            return;
        }

        try {
            String url = "https://graph.facebook.com/v21.0/" + phoneNumberId + "/messages";

            Map<String, Object> payload = Map.of(
                    "messaging_product", "whatsapp",
                    "to", phone,
                    "type", "template",
                    "template", Map.of(
                            "name", templateName,
                            "language", Map.of("code", languageCode),
                            "components", List.of(
                                    Map.of(
                                            "type", "body",
                                            "parameters", List.of(
                                                    text(order.getAddressFullName()),
                                                    text(order.getOrderNumber()),
                                                    text("₹" + order.getTotalAmount()),
                                                    text(order.getPaymentMethod().name())
                                            )
                                    )
                            )
                    )
            );

            String response = restClient.post()
                    .uri(url)
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            log.info("✅ WHATSAPP SENT SUCCESS -> phone={}, response={}", phone, response);

        } catch (Exception e) {
            log.error("❌ WHATSAPP FAILED -> phone={}, reason={}", phone, e.getMessage(), e);
        }
    }

    private Map<String, Object> text(String value) {
        return Map.of(
                "type", "text",
                "text", value == null ? "" : value
        );
    }

    private String normalizeIndiaPhone(String phone) {
        if (phone == null) return null;

        String digits = phone.replaceAll("[^0-9]", "");

        if (digits.length() == 10) {
            return "91" + digits;
        }

        if (digits.length() == 12 && digits.startsWith("91")) {
            return digits;
        }

        return null;
    }
}