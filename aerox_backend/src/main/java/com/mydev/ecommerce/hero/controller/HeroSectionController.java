package com.mydev.ecommerce.hero.controller;

import com.mydev.ecommerce.hero.dto.HeroSectionResponse;
import com.mydev.ecommerce.hero.service.HeroSectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hero-sections")
public class HeroSectionController {

    private final HeroSectionService heroSectionService;

    public HeroSectionController(HeroSectionService heroSectionService) {
        this.heroSectionService = heroSectionService;
    }

    @GetMapping
    public List<HeroSectionResponse> listPublic() {
        return heroSectionService.getPublicList();
    }
}