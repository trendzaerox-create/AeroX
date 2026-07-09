package com.mydev.ecommerce.brandshowcase.controller;

import com.mydev.ecommerce.brandshowcase.dto.BrandShowcaseRequest;
import com.mydev.ecommerce.brandshowcase.dto.BrandShowcaseResponse;
import com.mydev.ecommerce.brandshowcase.service.BrandShowcaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/brand-showcases")
public class AdminBrandShowcaseController {

    private final BrandShowcaseService brandShowcaseService;

    public AdminBrandShowcaseController(BrandShowcaseService brandShowcaseService) {
        this.brandShowcaseService = brandShowcaseService;
    }

    @GetMapping
    public List<BrandShowcaseResponse> list() {
        return brandShowcaseService.getAllAdminShowcases();
    }

    @GetMapping("/{id}")
    public BrandShowcaseResponse getOne(@PathVariable Long id) {
        return brandShowcaseService.getAdminShowcase(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BrandShowcaseResponse create(@Valid @RequestBody BrandShowcaseRequest request) {
        return brandShowcaseService.create(request);
    }

    @PutMapping("/{id}")
    public BrandShowcaseResponse update(
            @PathVariable Long id,
            @Valid @RequestBody BrandShowcaseRequest request
    ) {
        return brandShowcaseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        brandShowcaseService.delete(id);
    }
}