package com.mydev.ecommerce.email.service;

import com.mydev.ecommerce.email.dto.ReviewRequestEmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductReviewRequestEmailService {

    private final EmailService emailService;

    @Value("${app.mail.from-name:Trendz AeroX}")
    private String brandName;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    public void sendReviewRequestEmail(
            ReviewRequestEmailPayload payload
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
                "How are you enjoying your Trendz AeroX product? ⭐";

        emailService.sendHtmlEmail(
                payload.getCustomerEmail(),
                subject,
                buildHtml(payload)
        );
    }

    private String buildHtml(
            ReviewRequestEmailPayload payload
    ) {
        String orderUrl =
                trimTrailingSlash(frontendBaseUrl)
                        + "/account/orders/"
                        + payload.getOrderId();

        return """
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0"/>
                    <title>Review your product</title>
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
                           style="width:100%%;background:#f4f4f4;padding:28px 12px;">
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
                                                REVIEW REQUEST
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
                                                How was your experience?
                                            </h1>

                                            <p style="
                                                margin:0;
                                                color:#444444;
                                                font-size:16px;
                                                line-height:1.7;
                                            ">
                                                We hope you are enjoying your
                                                recent Trendz AeroX purchase.
                                                Your feedback helps us improve
                                                and helps other customers shop
                                                with confidence.
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:20px 30px;">
                                            %s
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            padding:8px 30px 34px;
                                            text-align:center;
                                        ">
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
                                            It only takes a minute, and your
                                            feedback means a lot to us.
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
                buildProductCards(payload),
                escapeHtml(orderUrl)
        );
    }

    private String buildProductCards(
            ReviewRequestEmailPayload payload
    ) {
        if (
                payload.getItems() == null
                        || payload.getItems().isEmpty()
        ) {
            return """
                    <div style="
                        border:1px solid #e5e5e5;
                        border-radius:8px;
                        padding:18px;
                        background:#fafafa;
                        text-align:center;
                    ">
                        <p style="
                            margin:0 0 14px;
                            font-size:15px;
                            color:#444444;
                        ">
                            Review your order and share your experience.
                        </p>
                    </div>
                    """;
        }

        StringBuilder html =
                new StringBuilder();

        for (
                ReviewRequestEmailPayload
                        .ReviewRequestEmailItemPayload item
                : payload.getItems()
        ) {
            String reviewUrl =
                    buildReviewUrl(
                            payload.getOrderId(),
                            item.getProductId()
                    );

            html.append(
                    """
                    <table role="presentation"
                           width="100%%"
                           cellspacing="0"
                           cellpadding="0"
                           style="
                               width:100%%;
                               border:1px solid #e5e5e5;
                               border-radius:8px;
                               background:#fafafa;
                               margin-bottom:12px;
                           ">
                        <tr>
                            <td style="padding:14px;width:82px;">
                                %s
                            </td>
                            <td style="padding:14px;">
                                <div style="
                                    font-size:15px;
                                    font-weight:700;
                                    color:#111111;
                                    line-height:1.4;
                                ">
                                    %s
                                </div>
                                <div style="
                                    margin-top:8px;
                                    color:#f5a400;
                                    font-size:18px;
                                    letter-spacing:1px;
                                ">
                                    ★★★★★
                                </div>
                                <a href="%s"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style="
                                       display:inline-block;
                                       margin-top:12px;
                                       padding:11px 16px;
                                       border-radius:6px;
                                       background:#111111;
                                       color:#ffffff;
                                       text-decoration:none;
                                       font-size:13px;
                                       font-weight:700;
                                   ">
                                    Write a review
                                </a>
                            </td>
                        </tr>
                    </table>
                    """.formatted(
                            buildImage(item.getImageUrl()),
                            escapeHtml(
                                    defaultValue(
                                            item.getProductTitle(),
                                            "Trendz AeroX Product"
                                    )
                            ),
                            escapeHtml(reviewUrl)
                    )
            );
        }

        return html.toString();
    }

    private String buildImage(
            String imageUrl
    ) {
        if (
                imageUrl == null
                        || imageUrl.isBlank()
        ) {
            return """
                    <div style="
                        width:68px;
                        height:68px;
                        border-radius:8px;
                        background:#eeeeee;
                    "></div>
                    """;
        }

        return """
                <img src="%s"
                     alt="Product"
                     style="
                         width:68px;
                         height:68px;
                         object-fit:cover;
                         border-radius:8px;
                         border:1px solid #e5e5e5;
                         background:#ffffff;
                     "/>
                """.formatted(
                escapeHtml(imageUrl)
        );
    }

    private String buildReviewUrl(
            Long orderId,
            Long productId
    ) {
        String baseUrl =
                trimTrailingSlash(frontendBaseUrl);

        if (productId == null) {
            return baseUrl
                    + "/account/orders/"
                    + orderId;
        }

        return baseUrl
                + "/product/"
                + productId
                + "?reviewOrderId="
                + orderId;
    }

    private String trimTrailingSlash(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value.endsWith("/")
                ? value.substring(0, value.length() - 1)
                : value;
    }

    private String defaultValue(
            String value,
            String fallback
    ) {
        return value == null || value.isBlank()
                ? fallback
                : value;
    }

    private String escapeHtml(
            String value
    ) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}