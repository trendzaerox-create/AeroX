package com.mydev.ecommerce.product.controller;

import com.mydev.ecommerce.common.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/upload")
public class ImageUploadController {

    private final FileStorageService storageService;

    public ImageUploadController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/product-images")
    public List<String> uploadProductImages(
            @RequestParam("files") MultipartFile[] files
    ) throws IOException {

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            FileStorageService.UploadResult result = storageService.saveFile(file);
            urls.add(result.imageUrl());
        }

        return urls;
    }
}