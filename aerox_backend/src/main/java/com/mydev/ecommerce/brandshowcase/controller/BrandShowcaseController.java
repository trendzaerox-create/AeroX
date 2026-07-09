package com.mydev.ecommerce.brandshowcase.controller;

import com.mydev.ecommerce.brandshowcase.dto.BrandShowcaseResponse;
import com.mydev.ecommerce.brandshowcase.service.BrandShowcaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brand-showcases")
public class BrandShowcaseController {

    private final BrandShowcaseService brandShowcaseService;

    public BrandShowcaseController(BrandShowcaseService brandShowcaseService) {
        this.brandShowcaseService = brandShowcaseService;
    }

    @GetMapping
    public List<BrandShowcaseResponse> list() {
        return brandShowcaseService.getActiveShowcases();
    }

    @GetMapping("/{id}")
    public BrandShowcaseResponse getOne(@PathVariable Long id) {
        return brandShowcaseService.getActiveShowcase(id);
    }
}