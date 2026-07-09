package com.mydev.ecommerce.hero.repository;

import com.mydev.ecommerce.hero.model.HeroSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HeroSectionRepository extends JpaRepository<HeroSection, Long> {

    List<HeroSection> findByDeletedFalseOrderBySortOrderAscCreatedAtDesc();

    List<HeroSection> findByActiveTrueAndDeletedFalseOrderBySortOrderAscCreatedAtDesc();

    Optional<HeroSection> findByIdAndDeletedFalse(Long id);
}