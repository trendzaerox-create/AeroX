
package com.mydev.ecommerce.giftbox.service;

import com.mydev.ecommerce.common.service.FileStorageService;
import com.mydev.ecommerce.giftbox.dto.GiftBoxRequest;
import com.mydev.ecommerce.giftbox.dto.GiftBoxResponse;
import com.mydev.ecommerce.giftbox.dto.GiftBoxSummaryResponse;
import com.mydev.ecommerce.giftbox.model.GiftBox;
import com.mydev.ecommerce.giftbox.repository.GiftBoxRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GiftBoxService {

    private final GiftBoxRepository giftBoxRepository;
    private final FileStorageService fileStorageService;

    public GiftBoxService(
            GiftBoxRepository giftBoxRepository,
            FileStorageService fileStorageService
    ) {
        this.giftBoxRepository = giftBoxRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<GiftBoxSummaryResponse> getActiveGiftBoxes() {
        return giftBoxRepository.findByActiveTrueAndDeletedFalseOrderByIdAsc()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GiftBoxResponse> getAllAdminGiftBoxes() {
        return giftBoxRepository.findByDeletedFalseOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GiftBoxResponse getAdminGiftBoxById(Long id) {
        GiftBox giftBox = giftBoxRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Gift box not found"));
        return toResponse(giftBox);
    }

    @Transactional(readOnly = true)
    public GiftBox getActiveGiftBoxEntity(Long id) {
        GiftBox giftBox = giftBoxRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Gift box not found: " + id));

        if (!giftBox.isActive()) {
            throw new IllegalArgumentException("Gift box is inactive: " + id);
        }

        return giftBox;
    }

    public GiftBoxResponse createGiftBox(GiftBoxRequest request) {
        GiftBox giftBox = new GiftBox();
        applyRequest(giftBox, request);
        return toResponse(giftBoxRepository.save(giftBox));
    }

    public GiftBoxResponse updateGiftBox(Long id, GiftBoxRequest request) {
        GiftBox giftBox = giftBoxRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Gift box not found"));

        applyRequest(giftBox, request);
        return toResponse(giftBoxRepository.save(giftBox));
    }

    public GiftBoxResponse updateStatus(Long id, boolean active) {
        GiftBox giftBox = giftBoxRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Gift box not found"));

        giftBox.setActive(active);
        return toResponse(giftBoxRepository.save(giftBox));
    }

    public void softDeleteGiftBox(Long id) {
        GiftBox giftBox = giftBoxRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException("Gift box not found"));

        if (giftBox.getCloudinaryPublicId() != null && !giftBox.getCloudinaryPublicId().isBlank()) {
            fileStorageService.deleteFile(giftBox.getCloudinaryPublicId());
        }

        giftBox.setDeleted(true);
        giftBox.setActive(false);
        giftBoxRepository.save(giftBox);
    }

    private void applyRequest(GiftBox giftBox, GiftBoxRequest request) {
        giftBox.setName(request.getName().trim());
        giftBox.setDescription(request.getDescription());
        giftBox.setPriceInr(request.getPriceInr());
        giftBox.setStock(request.getStock());
        giftBox.setActive(request.getActive() == null || request.getActive());

        if (request.getImagePath() != null &&
                !request.getImagePath().equals(giftBox.getImagePath())) {

            if (giftBox.getCloudinaryPublicId() != null && !giftBox.getCloudinaryPublicId().isBlank()) {
                fileStorageService.deleteFile(giftBox.getCloudinaryPublicId());
            }

            giftBox.setImagePath(request.getImagePath());
            giftBox.setCloudinaryPublicId(request.getCloudinaryPublicId());
        }
    }

    private GiftBoxResponse toResponse(GiftBox giftBox) {
        return GiftBoxResponse.builder()
                .id(giftBox.getId())
                .name(giftBox.getName())
                .description(giftBox.getDescription())
                .priceInr(giftBox.getPriceInr())
                .imagePath(giftBox.getImagePath())
                .cloudinaryPublicId(giftBox.getCloudinaryPublicId())
                .stock(giftBox.getStock())
                .active(giftBox.isActive())
                .deleted(giftBox.isDeleted())
                .createdAt(giftBox.getCreatedAt())
                .updatedAt(giftBox.getUpdatedAt())
                .build();
    }

    private GiftBoxSummaryResponse toSummaryResponse(GiftBox giftBox) {
        return GiftBoxSummaryResponse.builder()
                .id(giftBox.getId())
                .name(giftBox.getName())
                .priceInr(giftBox.getPriceInr())
                .imagePath(giftBox.getImagePath())
                .stock(giftBox.getStock())
                .active(giftBox.isActive())
                .build();
    }
}