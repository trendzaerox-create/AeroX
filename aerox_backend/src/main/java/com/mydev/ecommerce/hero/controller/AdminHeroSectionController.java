package com.mydev.ecommerce.hero.controller;

import com.mydev.ecommerce.hero.dto.HeroSectionRequest;
import com.mydev.ecommerce.hero.dto.HeroSectionResponse;
import com.mydev.ecommerce.hero.service.HeroSectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hero-sections")
public class AdminHeroSectionController {

    private final HeroSectionService heroSectionService;

    public AdminHeroSectionController(HeroSectionService heroSectionService) {
        this.heroSectionService = heroSectionService;
    }

    @GetMapping
    public List<HeroSectionResponse> listAdmin() {
        return heroSectionService.getAdminList();
    }

    @GetMapping("/{id}")
    public HeroSectionResponse getOne(@PathVariable Long id) {
        return heroSectionService.getAdminOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HeroSectionResponse create(@Valid @RequestBody HeroSectionRequest request) {
        return heroSectionService.create(request);
    }

    @PutMapping("/{id}")
    public HeroSectionResponse update(
            @PathVariable Long id,
            @Valid @RequestBody HeroSectionRequest request
    ) {
        return heroSectionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        heroSectionService.delete(id);
    }
}