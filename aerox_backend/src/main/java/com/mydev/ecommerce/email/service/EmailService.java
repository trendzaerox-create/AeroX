

package com.mydev.ecommerce.email.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final String BREVO_SEND_EMAIL_URL =
            "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient = RestClient.create();

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from-email:sales@trendzaerox.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:Trendz AeroX}")
    private String fromName;

    @Value("${app.mail.brevo.api-key}")
    private String brevoApiKey;

    @PostConstruct
    public void printMailConfigOnStartup() {
        log.info("==================================================");
        log.info("🚀 EMAIL SERVICE LOADED");
        log.info("📁 user.dir = {}", System.getProperty("user.dir"));
        log.info("📦 class location = {}", getClassLocation());
        log.info("📧 CONFIG mailEnabled = {}", mailEnabled);
        log.info("📧 CONFIG fromName = [{}]", fromName);
        log.info("📧 CONFIG fromEmail = [{}]", fromEmail);
        log.info("🔑 CONFIG brevoApiKey = {}", maskApiKey(brevoApiKey));
        log.info("🌍 ENV MAIL_ENABLED = [{}]", System.getenv("MAIL_ENABLED"));
        log.info("🌍 ENV MAIL_FROM_NAME = [{}]", System.getenv("MAIL_FROM_NAME"));
        log.info("🌍 ENV MAIL_FROM_EMAIL = [{}]", System.getenv("MAIL_FROM_EMAIL"));
        log.info("==================================================");
    }

    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlBody
    ) {
        boolean blockLocalEmailForTest = false;

        if (blockLocalEmailForTest) {
            throw new IllegalStateException(
                    "LOCAL AEROX EMAIL SERVICE BLOCKED FOR TEST - if email still arrives, it is NOT from this backend"
            );
        }

        log.info("==================================================");
        log.info("🔥 MAIL FLOW START");
        log.info("📧 TO = [{}]", to);
        log.info("📧 SUBJECT = [{}]", subject);
        log.info("📧 ACTUAL FROM NAME = [{}]", fromName);
        log.info("📧 ACTUAL FROM EMAIL = [{}]", fromEmail);
        log.info("🔑 BREVO API KEY = {}", maskApiKey(brevoApiKey));
        log.info("==================================================");

        if (
                to == null
                        || to.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Email recipient is missing"
            );
        }

        if (
                subject == null
                        || subject.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Email subject is missing"
            );
        }

        if (
                htmlBody == null
                        || htmlBody.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Email HTML body is missing"
            );
        }

        if (!mailEnabled) {
            log.warn("❌ Mail disabled. Email not sent to {}", to);

            throw new IllegalStateException(
                    "Mail is disabled. Set MAIL_ENABLED=true to send emails."
            );
        }

        if (
                brevoApiKey == null
                        || brevoApiKey.isBlank()
        ) {
            throw new IllegalStateException(
                    "BREVO_API_KEY is missing"
            );
        }

        if (
                fromEmail == null
                        || fromEmail.isBlank()
        ) {
            throw new IllegalStateException(
                    "MAIL_FROM_EMAIL is missing"
            );
        }

        if (
                fromName == null
                        || fromName.isBlank()
        ) {
            throw new IllegalStateException(
                    "MAIL_FROM_NAME is missing"
            );
        }

        if (
                containsOldFirenzeValue(fromName)
                        || containsOldFirenzeValue(fromEmail)
        ) {
            log.error("❌ OLD FIRENZE CONFIG DETECTED");
            log.error("❌ fromName = [{}]", fromName);
            log.error("❌ fromEmail = [{}]", fromEmail);

            throw new IllegalStateException(
                    "Old Trendz Firenze mail config detected. Fix MAIL_FROM_NAME / MAIL_FROM_EMAIL."
            );
        }

        try {
            Map<String, Object> payload =
                    Map.of(
                            "sender",
                            Map.of(
                                    "name", fromName,
                                    "email", fromEmail
                            ),
                            "to",
                            List.of(
                                    Map.of(
                                            "email", to.trim()
                                    )
                            ),
                            "subject",
                            subject,
                            "htmlContent",
                            htmlBody
                    );

            log.info("📤 BREVO PAYLOAD SENDER NAME = [{}]", fromName);
            log.info("📤 BREVO PAYLOAD SENDER EMAIL = [{}]", fromEmail);

            String response =
                    restClient.post()
                            .uri(BREVO_SEND_EMAIL_URL)
                            .header("accept", "application/json")
                            .header("api-key", brevoApiKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(payload)
                            .retrieve()
                            .body(String.class);

            log.info(
                    "✅ EMAIL SENT SUCCESS -> to={}, response={}",
                    to,
                    response
            );

        } catch (Exception exception) {
            log.error(
                    "❌ EMAIL FAILED -> to={}, fromName={}, fromEmail={}, reason={}",
                    to,
                    fromName,
                    fromEmail,
                    exception.getMessage(),
                    exception
            );

            throw new RuntimeException(
                    "Email failed: " + exception.getMessage(),
                    exception
            );
        }
    }

    private boolean containsOldFirenzeValue(
            String value
    ) {
        if (value == null) {
            return false;
        }

        String lowerValue =
                value.toLowerCase();

        return lowerValue.contains("firenze")
                || lowerValue.contains("trendzfirenze");
    }

    private String maskApiKey(
            String key
    ) {
        if (
                key == null
                        || key.isBlank()
        ) {
            return "MISSING";
        }

        if (key.length() <= 12) {
            return "PRESENT length=" + key.length();
        }

        return key.substring(0, 12)
                + "..."
                + key.substring(key.length() - 4)
                + " length="
                + key.length();
    }

    private String getClassLocation() {
        try {
            return String.valueOf(
                    EmailService.class
                            .getProtectionDomain()
                            .getCodeSource()
                            .getLocation()
            );
        } catch (Exception exception) {
            return "unknown";
        }
    }
}