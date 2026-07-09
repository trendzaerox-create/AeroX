package com.mydev.ecommerce.newsletter.controller;

import com.mydev.ecommerce.newsletter.dto.NewsletterMessageResponse;
import com.mydev.ecommerce.newsletter.dto.NewsletterSubscribeRequest;
import com.mydev.ecommerce.newsletter.dto.NewsletterSubscriberResponse;
import com.mydev.ecommerce.newsletter.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<NewsletterMessageResponse> subscribe(
            @Valid @RequestBody NewsletterSubscribeRequest request
    ) {
        newsletterService.subscribe(request.getEmail());

        return ResponseEntity.ok(
                NewsletterMessageResponse.builder()
                        .message("Thank you for subscribing to Trendz AeroX.")
                        .build()
        );
    }

    @GetMapping("/admin/newsletter/subscribers")
    public ResponseEntity<List<NewsletterSubscriberResponse>> getAllSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }

    @DeleteMapping("/admin/newsletter/subscribers/{id}")
    public ResponseEntity<NewsletterMessageResponse> deleteSubscriber(
            @PathVariable Long id
    ) {
        newsletterService.deleteSubscriber(id);

        return ResponseEntity.ok(
                NewsletterMessageResponse.builder()
                        .message("Subscriber deleted successfully")
                        .build()
        );
    }
}