package com.mydev.ecommerce.brandshowcase.controller;

import com.mydev.ecommerce.common.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/brand-showcases")
public class BrandShowcaseUploadController {

    private final FileStorageService fileStorageService;

    public BrandShowcaseUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload-model-image")
    public Map<String, String> uploadModelImage(@RequestParam("file") MultipartFile file) throws IOException {
        FileStorageService.UploadResult result =
                fileStorageService.saveBrandShowcaseFile(file);

        return Map.of(
                "imageUrl", result.imageUrl(),
                "cloudinaryPublicId", result.publicId()
        );
    }
}