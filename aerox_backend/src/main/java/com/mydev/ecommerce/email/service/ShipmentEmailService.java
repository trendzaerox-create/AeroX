package com.mydev.ecommerce.email.service;

import com.mydev.ecommerce.email.dto.ShipmentEmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ShipmentEmailService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern(
                    "dd MMM yyyy, hh:mm a"
            );

    private final EmailService emailService;

    @Value(
            "${app.mail.from-name:Trendz AeroX}"
    )
    private String brandName;

    @Value(
            "${app.frontend.base-url:http://localhost:3000}"
    )
    private String frontendBaseUrl;

    public void sendShipmentConfirmationEmail(
            ShipmentEmailPayload payload
    ) {
        if (
                payload.getCustomerEmail() == null
                        || payload.getCustomerEmail().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Customer email is missing"
            );
        }

        String subject =
                "Your order is on the way - "
                        + safe(payload.getOrderNumber());

        emailService.sendHtmlEmail(
                payload.getCustomerEmail(),
                subject,
                buildHtml(payload)
        );
    }

    private String buildHtml(
            ShipmentEmailPayload payload
    ) {
        String orderUrl =
                trimTrailingSlash(frontendBaseUrl)
                        + "/account/orders/"
                        + payload.getOrderId();

        String trackingButton =
                buildTrackingButton(
                        payload.getTrackingUrl()
                );

        String shippedAt =
                payload.getShippedAt() == null
                        ? ""
                        : DATE_FORMATTER.format(
                                payload.getShippedAt()
                        );

        return """
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0"/>
                    <title>Order shipped</title>
                </head>

                <body style="
                    margin:0;
                    padding:0;
                    background:#f4f4f4;
                    font-family:Arial,Helvetica,sans-serif;
                    color:#111111;
                ">

                    <table role="presentation"
                           width="100%%"
                           cellspacing="0"
                           cellpadding="0"
                           style="
                               width:100%%;
                               background:#f4f4f4;
                               padding:28px 12px;
                           ">

                        <tr>
                            <td align="center">

                                <table role="presentation"
                                       width="100%%"
                                       cellspacing="0"
                                       cellpadding="0"
                                       style="
                                           width:100%%;
                                           max-width:640px;
                                           background:#ffffff;
                                           border:1px solid #e5e5e5;
                                           border-radius:10px;
                                           overflow:hidden;
                                       ">

                                    <tr>
                                        <td style="
                                            background:#111111;
                                            color:#ffffff;
                                            padding:24px 30px;
                                            text-align:center;
                                        ">
                                            <div style="
                                                font-size:23px;
                                                font-weight:800;
                                                letter-spacing:1.5px;
                                            ">
                                                %s
                                            </div>

                                            <div style="
                                                margin-top:6px;
                                                color:#d4d4d4;
                                                font-size:12px;
                                                letter-spacing:2px;
                                            ">
                                                SHIPMENT UPDATE
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:34px 30px 12px;">

                                            <p style="
                                                margin:0 0 8px;
                                                color:#666666;
                                                font-size:14px;
                                            ">
                                                Hi %s,
                                            </p>

                                            <h1 style="
                                                margin:0 0 14px;
                                                font-size:27px;
                                                line-height:1.3;
                                            ">
                                                Your order is on the way
                                            </h1>

                                            <p style="
                                                margin:0;
                                                color:#444444;
                                                font-size:16px;
                                                line-height:1.7;
                                            ">
                                                Your order
                                                <strong>%s</strong>
                                                has been shipped through
                                                <strong>%s</strong>.
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:20px 30px;">

                                            <table role="presentation"
                                                   width="100%%"
                                                   cellspacing="0"
                                                   cellpadding="0"
                                                   style="
                                                       width:100%%;
                                                       border:1px solid #dddddd;
                                                       background:#fafafa;
                                                       border-radius:8px;
                                                   ">

                                                <tr>
                                                    <td style="%s">
                                                        Order number
                                                    </td>

                                                    <td align="right"
                                                        style="%s">
                                                        %s
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="%s">
                                                        Courier
                                                    </td>

                                                    <td align="right"
                                                        style="%s">
                                                        %s
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="%s">
                                                        Tracking ID / AWB
                                                    </td>

                                                    <td align="right"
                                                        style="%s">
                                                        %s
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="%s">
                                                        Shipped on
                                                    </td>

                                                    <td align="right"
                                                        style="%s">
                                                        %s
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="%s">
                                                        Order total
                                                    </td>

                                                    <td align="right"
                                                        style="%s">
                                                        %s
                                                    </td>
                                                </tr>

                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            padding:8px 30px 34px;
                                            text-align:center;
                                        ">

                                            %s

                                            <a href="%s"
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               style="
                                                   display:inline-block;
                                                   margin:10px 4px 0;
                                                   padding:13px 22px;
                                                   border:1px solid #111111;
                                                   border-radius:6px;
                                                   color:#111111;
                                                   text-decoration:none;
                                                   font-size:14px;
                                                   font-weight:700;
                                               ">
                                                View order
                                            </a>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            padding:20px 30px;
                                            border-top:1px solid #e5e5e5;
                                            background:#f7f7f7;
                                            color:#777777;
                                            text-align:center;
                                            font-size:12px;
                                            line-height:1.6;
                                        ">
                                            Courier tracking may take some time
                                            to appear after the parcel is handed
                                            over to the courier.
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                escapeHtml(brandName),
                escapeHtml(
                        defaultValue(
                                payload.getCustomerName(),
                                "Customer"
                        )
                ),
                escapeHtml(payload.getOrderNumber()),
                escapeHtml(payload.getCourierName()),

                labelCellStyle(true),
                valueCellStyle(true),
                escapeHtml(payload.getOrderNumber()),

                labelCellStyle(true),
                valueCellStyle(true),
                escapeHtml(payload.getCourierName()),

                labelCellStyle(true),
                valueCellStyle(true),
                escapeHtml(payload.getTrackingId()),

                labelCellStyle(true),
                valueCellStyle(true),
                escapeHtml(shippedAt),

                labelCellStyle(false),
                valueCellStyle(false),
                formatMoney(payload.getTotalAmount()),

                trackingButton,
                escapeHtml(orderUrl)
        );
    }

    private String buildTrackingButton(
            String trackingUrl
    ) {
        if (
                trackingUrl == null
                        || trackingUrl.isBlank()
        ) {
            return "";
        }

        return """
                <a href="%s"
                   target="_blank"
                   rel="noopener noreferrer"
                   style="
                       display:inline-block;
                       margin:10px 4px 0;
                       padding:14px 22px;
                       border-radius:6px;
                       background:#111111;
                       color:#ffffff;
                       text-decoration:none;
                       font-size:14px;
                       font-weight:700;
                   ">
                    Track shipment
                </a>
                """.formatted(
                escapeHtml(trackingUrl)
        );
    }

    private String labelCellStyle(
            boolean withBorder
    ) {
        return "padding:15px;"
                + (
                withBorder
                        ? "border-bottom:1px solid #e5e5e5;"
                        : ""
        )
                + "color:#666666;font-size:13px;";
    }

    private String valueCellStyle(
            boolean withBorder
    ) {
        return "padding:15px;"
                + (
                withBorder
                        ? "border-bottom:1px solid #e5e5e5;"
                        : ""
        )
                + "font-weight:700;"
                + "word-break:break-word;";
    }

    private String formatMoney(
            BigDecimal amount
    ) {
        BigDecimal safeAmount =
                amount == null
                        ? BigDecimal.ZERO
                        : amount;

        return "₹"
                + safeAmount
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                )
                .toPlainString();
    }

    private String trimTrailingSlash(
            String value
    ) {
        if (
                value == null
                        || value.isBlank()
        ) {
            return "http://localhost:3000";
        }

        String trimmed = value.trim();

        while (
                trimmed.endsWith("/")
                        && trimmed.length() > 1
        ) {
            trimmed =
                    trimmed.substring(
                            0,
                            trimmed.length() - 1
                    );
        }

        return trimmed;
    }

    private String defaultValue(
            String value,
            String fallback
    ) {
        return value == null || value.isBlank()
                ? fallback
                : value;
    }

    private String safe(
            String value
    ) {
        return value == null
                ? ""
                : value;
    }

    private String escapeHtml(
            String value
    ) {
        return safe(value)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}