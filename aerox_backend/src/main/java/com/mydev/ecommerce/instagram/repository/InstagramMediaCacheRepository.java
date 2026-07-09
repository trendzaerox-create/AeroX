package com.mydev.ecommerce.instagram.repository;

import com.mydev.ecommerce.instagram.entity.InstagramMediaCache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstagramMediaCacheRepository extends JpaRepository<InstagramMediaCache, Long> {
    Optional<InstagramMediaCache> findByCacheKey(String cacheKey);
}