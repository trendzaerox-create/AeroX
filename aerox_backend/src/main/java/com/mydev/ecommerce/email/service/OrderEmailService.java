package com.mydev.ecommerce.email.service;

import com.mydev.ecommerce.email.dto.OrderEmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderEmailService {

    private final EmailService emailService;

    @Value("${app.mail.admin-email}")
    private String adminEmail;

    public void sendCodOrderPlacedCustomerEmail(OrderEmailPayload payload) {
        String subject = "Order Confirmed - " + payload.getOrderNumber();
        emailService.sendHtmlEmail(
                payload.getCustomerEmail(),
                subject,
                buildCustomerOrderHtml(payload, "Your COD order has been placed successfully.")
        );
    }

    public void sendPaidOrderConfirmedCustomerEmail(OrderEmailPayload payload) {
        String subject = "Payment Confirmed - " + payload.getOrderNumber();
        emailService.sendHtmlEmail(
                payload.getCustomerEmail(),
                subject,
                buildCustomerOrderHtml(payload, "Your payment was successful and your order is confirmed.")
        );
    }

    public void sendOrderAdminNotification(OrderEmailPayload payload, String headline) {
        String subject = "New Order - " + payload.getOrderNumber();
        emailService.sendHtmlEmail(
                adminEmail,
                subject,
                buildAdminOrderHtml(payload, headline)
        );
    }

    private String buildCustomerOrderHtml(OrderEmailPayload payload, String headline) {
        StringBuilder itemsHtml = new StringBuilder();

        for (OrderEmailPayload.OrderEmailItemPayload item : payload.getItems()) {
            itemsHtml.append("""
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #e5e7eb;">%s</td>
                  <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">%d</td>
                  <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">₹%s</td>
                  <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">₹%s</td>
                </tr>
            """.formatted(
                    safe(item.getProductTitle()),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getLineTotal()
            ));
        }

        return """
            <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;background:#ffffff;color:#111827;">
              <h2 style="margin-bottom:8px;">Trendz AeroX</h2>
              <p style="font-size:16px;color:#111827;">%s</p>
              <p><strong>Order Number:</strong> %s</p>
              <p><strong>Payment Method:</strong> %s</p>
              <p><strong>Payment Status:</strong> %s</p>

              <h3 style="margin-top:24px;">Items</h3>
              <table style="width:100%%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px;text-align:left;">Product</th>
                    <th style="padding:10px;text-align:center;">Qty</th>
                    <th style="padding:10px;text-align:right;">Unit Price</th>
                    <th style="padding:10px;text-align:right;">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  %s
                </tbody>
              </table>

              <h3 style="margin-top:24px;">Summary</h3>
              <p><strong>Subtotal:</strong> ₹%s</p>
              <p><strong>Shipping:</strong> ₹%s</p>
              <p><strong>Discount:</strong> ₹%s</p>
              <p><strong>Total:</strong> ₹%s</p>

              <h3 style="margin-top:24px;">Delivery Address</h3>
              <p style="line-height:1.7;">
                %s<br/>
                %s<br/>
                %s %s<br/>
                %s, %s - %s<br/>
                %s
              </p>
            </div>
        """.formatted(
                safe(headline),
                safe(payload.getOrderNumber()),
                safe(payload.getPaymentMethod()),
                safe(payload.getPaymentStatus()),
                itemsHtml,
                payload.getSubtotalAmount(),
                payload.getShippingAmount(),
                payload.getDiscountAmount(),
                payload.getTotalAmount(),
                safe(payload.getAddressFullName()),
                safe(payload.getAddressPhone()),
                safe(payload.getAddressLine1()),
                safe(payload.getAddressLine2()),
                safe(payload.getAddressCity()),
                safe(payload.getAddressState()),
                safe(payload.getAddressPincode()),
                safe(payload.getAddressCountry())
        );
    }

    private String buildAdminOrderHtml(OrderEmailPayload payload, String headline) {
        return buildCustomerOrderHtml(payload, headline + " Customer: " + safe(payload.getCustomerName()));
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}