package com.mydev.ecommerce.newsletter.repository;

import com.mydev.ecommerce.newsletter.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<NewsletterSubscriber> findByEmailIgnoreCase(String email);
}