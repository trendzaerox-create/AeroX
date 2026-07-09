package com.mydev.ecommerce.hero.service;

import com.mydev.ecommerce.hero.dto.HeroSectionRequest;
import com.mydev.ecommerce.hero.dto.HeroSectionResponse;
import com.mydev.ecommerce.hero.model.HeroSection;
import com.mydev.ecommerce.hero.repository.HeroSectionRepository;
import com.mydev.ecommerce.product.model.Product;
import com.mydev.ecommerce.product.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HeroSectionService {

    private final HeroSectionRepository heroSectionRepository;
    private final ProductRepository productRepository;

    public HeroSectionService(
            HeroSectionRepository heroSectionRepository,
            ProductRepository productRepository
    ) {
        this.heroSectionRepository = heroSectionRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<HeroSectionResponse> getAdminList() {
        return heroSectionRepository.findByDeletedFalseOrderBySortOrderAscCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HeroSectionResponse> getPublicList() {
        return heroSectionRepository.findByActiveTrueAndDeletedFalseOrderBySortOrderAscCreatedAtDesc()
                .stream()
                .filter(hero -> hero.getProduct() != null
                        && hero.getProduct().isActive()
                        && !hero.getProduct().isDeleted())
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HeroSectionResponse getAdminOne(Long id) {
        HeroSection hero = heroSectionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Hero section not found"));
        return mapToResponse(hero);
    }

    @Transactional
    public HeroSectionResponse create(HeroSectionRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Linked product not found"));

        HeroSection hero = new HeroSection();
        hero.setTitle(request.title().trim());
        hero.setDescription(request.description() != null ? request.description().trim() : null);
        hero.setImageUrl(request.imageUrl().trim());
        hero.setCloudinaryPublicId(
                request.cloudinaryPublicId() != null && !request.cloudinaryPublicId().isBlank()
                        ? request.cloudinaryPublicId().trim()
                        : null
        );
        hero.setProduct(product);
        hero.setSortOrder(request.sortOrder());
        hero.setActive(request.active());

        return mapToResponse(heroSectionRepository.save(hero));
    }

    @Transactional
    public HeroSectionResponse update(Long id, HeroSectionRequest request) {
        HeroSection hero = heroSectionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Hero section not found"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Linked product not found"));

        hero.setTitle(request.title().trim());
        hero.setDescription(request.description() != null ? request.description().trim() : null);
        hero.setImageUrl(request.imageUrl().trim());
        hero.setCloudinaryPublicId(
                request.cloudinaryPublicId() != null && !request.cloudinaryPublicId().isBlank()
                        ? request.cloudinaryPublicId().trim()
                        : null
        );
        hero.setProduct(product);
        hero.setSortOrder(request.sortOrder());
        hero.setActive(request.active());

        return mapToResponse(heroSectionRepository.save(hero));
    }

    @Transactional
    public void delete(Long id) {
        HeroSection hero = heroSectionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Hero section not found"));

        hero.setActive(false);
        hero.setDeleted(true);
        heroSectionRepository.save(hero);
    }

    private HeroSectionResponse mapToResponse(HeroSection hero) {
        return new HeroSectionResponse(
                hero.getId(),
                hero.getTitle(),
                hero.getDescription(),
                hero.getImageUrl(),
                hero.getCloudinaryPublicId(),
                hero.getProduct() != null ? hero.getProduct().getId() : null,
                hero.getProduct() != null ? hero.getProduct().getTitle() : null,
                hero.getSortOrder(),
                hero.isActive()
        );
    }
}