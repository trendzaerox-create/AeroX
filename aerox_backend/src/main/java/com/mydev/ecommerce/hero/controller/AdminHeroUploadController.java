package com.mydev.ecommerce.hero.controller;

import com.mydev.ecommerce.common.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/hero-sections")
public class AdminHeroUploadController {

    private final FileStorageService storageService;

    public AdminHeroUploadController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public Map<String, String> uploadHeroImage(@RequestParam("file") MultipartFile file) throws IOException {
        FileStorageService.UploadResult result = storageService.saveFile(file);

        return Map.of(
                "imageUrl", result.imageUrl(),
                "publicId", result.publicId() != null ? result.publicId() : ""
        );
    }
}