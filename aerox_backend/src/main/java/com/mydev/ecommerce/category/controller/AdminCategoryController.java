
// package com.mydev.ecommerce.category.controller;

// import com.mydev.ecommerce.category.dto.CategoryRequest;
// import com.mydev.ecommerce.category.model.Category;
// import com.mydev.ecommerce.category.repository.CategoryRepository;
// import com.mydev.ecommerce.common.service.FileStorageService;
// import jakarta.validation.Valid;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.server.ResponseStatusException;

// import java.io.IOException;
// import java.util.Comparator;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/admin/categories")
// public class AdminCategoryController {

//     private final CategoryRepository repo;
//     private final FileStorageService fileStorageService;

//     public AdminCategoryController(
//             CategoryRepository repo,
//             FileStorageService fileStorageService
//     ) {
//         this.repo = repo;
//         this.fileStorageService = fileStorageService;
//     }

//     @GetMapping
//     public List<Category> list() {
//         return repo.findAll()
//                 .stream()
//                 .sorted(Comparator.comparing(Category::getId))
//                 .toList();
//     }

//     @GetMapping("/{id}")
//     public Category getOne(@PathVariable Long id) {
//         return repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(
//                         HttpStatus.NOT_FOUND,
//                         "Category not found"
//                 ));
//     }

// @PostMapping
// @ResponseStatus(HttpStatus.CREATED)
// public Category create(@Valid @RequestBody CategoryRequest req) {
//     Category c = new Category();

//     c.setName(req.name().trim());
//     c.setImageUrls(cleanList(req.imageUrls()));
//     c.setBannerImageUrls(cleanList(req.bannerImageUrls()));
//     c.setThinBannerImageUrls(cleanList(req.thinBannerImageUrls()));

//     return repo.save(c);
// }

// @PutMapping("/{id}")
// public Category update(
//         @PathVariable Long id,
//         @Valid @RequestBody CategoryRequest req
// ) {
//     Category c = repo.findById(id)
//             .orElseThrow(() -> new ResponseStatusException(
//                     HttpStatus.NOT_FOUND,
//                     "Category not found"
//             ));

//     c.setName(req.name().trim());
//     c.setImageUrls(cleanList(req.imageUrls()));
//     c.setBannerImageUrls(cleanList(req.bannerImageUrls()));
//     c.setThinBannerImageUrls(cleanList(req.thinBannerImageUrls()));

//     return repo.save(c);
// }

// private List<String> cleanList(List<String> values) {
//     if (values == null) {
//         return List.of();
//     }

//     return values.stream()
//             .filter(value -> value != null && !value.isBlank())
//             .map(String::trim)
//             .toList();
// }

//     @DeleteMapping("/{id}")
//     @ResponseStatus(HttpStatus.NO_CONTENT)
//     public void delete(@PathVariable Long id) {
//         Category c = repo.findById(id)
//                 .orElseThrow(() -> new ResponseStatusException(
//                         HttpStatus.NOT_FOUND,
//                         "Category not found"
//                 ));

//         repo.delete(c);
//     }

//     private String clean(String value) {
//         return value != null && !value.isBlank()
//                 ? value.trim()
//                 : null;
//     }
// }
















package com.mydev.ecommerce.category.controller;

import com.mydev.ecommerce.category.dto.CategoryRequest;
import com.mydev.ecommerce.category.model.Category;
import com.mydev.ecommerce.category.repository.CategoryRepository;
import com.mydev.ecommerce.common.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryRepository repo;
    private final FileStorageService fileStorageService;

    public AdminCategoryController(
            CategoryRepository repo,
            FileStorageService fileStorageService
    ) {
        this.repo = repo;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<Category> list() {
        return repo.findAll()
                .stream()
                .sorted(Comparator.comparing(Category::getId))
                .toList();
    }

    @GetMapping("/{id}")
    public Category getOne(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    @PostMapping("/upload-images")
    public Map<String, List<String>> uploadImages(
            @RequestParam("files") List<MultipartFile> files
    ) {
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No files selected"
            );
        }

        try {
            List<String> urls = files.stream()
                    .filter(file -> file != null && !file.isEmpty())
                    .map(file -> {
                        try {
                            return fileStorageService.saveCategoryFile(file).imageUrl();
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();

            if (urls.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No valid files selected"
                );
            }

            return Map.of("urls", urls);

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload category images: " + e.getMessage(),
                    e
            );
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody CategoryRequest req) {
        Category c = new Category();

        c.setName(req.name().trim());
        c.setImageUrls(cleanList(req.imageUrls()));
        c.setBannerImageUrls(cleanList(req.bannerImageUrls()));
        c.setThinBannerImageUrls(cleanList(req.thinBannerImageUrls()));

        return repo.save(c);
    }

    @PutMapping("/{id}")
    public Category update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest req
    ) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        c.setName(req.name().trim());
        c.setImageUrls(cleanList(req.imageUrls()));
        c.setBannerImageUrls(cleanList(req.bannerImageUrls()));
        c.setThinBannerImageUrls(cleanList(req.thinBannerImageUrls()));

        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        repo.delete(c);
    }

    private List<String> cleanList(List<String> values) {
        if (values == null) {
            return List.of();
        }

        return values.stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::trim)
                .toList();
    }
}