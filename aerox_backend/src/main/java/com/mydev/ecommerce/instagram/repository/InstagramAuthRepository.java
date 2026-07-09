package com.mydev.ecommerce.instagram.repository;

import com.mydev.ecommerce.instagram.entity.InstagramAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstagramAuthRepository extends JpaRepository<InstagramAuth, Long> {
    Optional<InstagramAuth> findFirstByActiveTrueOrderByIdDesc();
}