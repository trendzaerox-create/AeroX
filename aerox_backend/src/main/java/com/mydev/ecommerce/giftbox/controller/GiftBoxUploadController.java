package com.mydev.ecommerce.giftbox.controller;

import com.mydev.ecommerce.common.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/gift-boxes")
public class GiftBoxUploadController {

    private final FileStorageService fileStorageService;

    public GiftBoxUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestPart("file") MultipartFile file) throws IOException {

        var result = fileStorageService.saveFile(file, "trendz-firenze/gift-boxes");

        return Map.of(
                "imageUrl", result.imageUrl(),
                "publicId", result.publicId()
        );
    }
}