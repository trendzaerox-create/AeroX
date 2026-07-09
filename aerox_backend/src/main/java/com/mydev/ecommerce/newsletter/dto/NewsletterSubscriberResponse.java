package com.mydev.ecommerce.newsletter.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsletterSubscriberResponse {

    private Long id;
    private String email;
    private LocalDateTime subscribedAt;
}