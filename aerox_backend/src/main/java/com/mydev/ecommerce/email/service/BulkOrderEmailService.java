package com.mydev.ecommerce.email.service;

import com.mydev.ecommerce.email.dto.BulkInquiryEmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BulkOrderEmailService {

    private final EmailService emailService;

    @Value("${app.mail.admin-email}")
    private String adminEmail;

    public void sendAdminNotification(BulkInquiryEmailPayload payload) {
        String subject = "New Bulk Order Inquiry - " + payload.getProductTitle();

        String html = """
            <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;background:#ffffff;color:#111827;">
              <h2>New Bulk Order Inquiry</h2>
              <p><strong>Customer Name:</strong> %s</p>
              <p><strong>Email:</strong> %s</p>
              <p><strong>Phone:</strong> %s</p>
              <p><strong>Company:</strong> %s</p>
              <p><strong>Quantity:</strong> %s</p>
              <p><strong>Product:</strong> %s</p>
              <p><strong>Price:</strong> ₹%s</p>
              <p><strong>Message:</strong><br/>%s</p>
            </div>
        """.formatted(
                safe(payload.getCustomerName()),
                safe(payload.getCustomerEmail()),
                safe(payload.getPhone()),
                safe(payload.getCompanyName()),
                payload.getQuantity(),
                safe(payload.getProductTitle()),
                payload.getProductPriceInr(),
                safe(payload.getMessage())
        );

        emailService.sendHtmlEmail(adminEmail, subject, html);
    }

    public void sendCustomerAcknowledgement(BulkInquiryEmailPayload payload) {
        String subject = "We Received Your Bulk Inquiry - Trendz AeroX";

        String html = """
            <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;background:#ffffff;color:#111827;">
              <h2>Thank you for your inquiry</h2>
              <p>Hi %s,</p>
              <p>We have received your bulk order inquiry for <strong>%s</strong>.</p>
              <p><strong>Requested Quantity:</strong> %s</p>
              <p>Our team will contact you soon.</p>
              <p>Regards,<br/>Trendz AeroX</p>
            </div>
        """.formatted(
                safe(payload.getCustomerName()),
                safe(payload.getProductTitle()),
                payload.getQuantity()
        );

        emailService.sendHtmlEmail(payload.getCustomerEmail(), subject, html);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}