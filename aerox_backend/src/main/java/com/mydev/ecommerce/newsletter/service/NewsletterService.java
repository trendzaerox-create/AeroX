package com.mydev.ecommerce.newsletter.service;

import com.mydev.ecommerce.newsletter.dto.NewsletterSubscriberResponse;
import com.mydev.ecommerce.newsletter.model.NewsletterSubscriber;
import com.mydev.ecommerce.newsletter.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository repository;

    public NewsletterSubscriberResponse subscribe(String email) {
        String cleanEmail = email.trim().toLowerCase();

        if (repository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new RuntimeException("This email is already subscribed");
        }

        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(cleanEmail)
                .build();

        NewsletterSubscriber saved = repository.save(subscriber);

        return mapToResponse(saved);
    }

    public List<NewsletterSubscriberResponse> getAllSubscribers() {
        return repository.findAll()
                .stream()
                .sorted((a, b) -> b.getSubscribedAt().compareTo(a.getSubscribedAt()))
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteSubscriber(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Subscriber not found");
        }

        repository.deleteById(id);
    }

    private NewsletterSubscriberResponse mapToResponse(NewsletterSubscriber subscriber) {
        return NewsletterSubscriberResponse.builder()
                .id(subscriber.getId())
                .email(subscriber.getEmail())
                .subscribedAt(subscriber.getSubscribedAt())
                .build();
    }
}