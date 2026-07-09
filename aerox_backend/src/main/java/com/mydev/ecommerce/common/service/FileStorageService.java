
package com.mydev.ecommerce.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.Normalizer;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private static final long LARGE_FILE_LIMIT = 10L * 1024L * 1024L; // 10MB

    private final Cloudinary cloudinary;

    public FileStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public UploadResult saveFile(MultipartFile file) throws IOException {
        return saveFile(file, "trendz-firenze/products");
    }

    public UploadResult saveGiftBoxFile(MultipartFile file) throws IOException {
        return saveFile(file, "trendz-firenze/gift-boxes");
    }

    public UploadResult saveBrandShowcaseFile(MultipartFile file) throws IOException {
        return saveFile(file, "trendz-firenze/brand-showcases");
    }


    public UploadResult saveCategoryFile(MultipartFile file) throws IOException {
    return saveFile(file, "trendz-firenze/categories");
}



    public UploadResult saveFile(MultipartFile file, String folder) throws IOException {

        log.info("========== Cloudinary Upload Started ==========");

        if (file == null) {
            throw new RuntimeException("File is null");
        }

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        long fileSize = file.getSize();

        log.info("Original filename: {}", originalFilename);
        log.info("Content type: {}", contentType);
        log.info("File size: {} bytes", fileSize);
        log.info("Upload folder: {}", folder);

        boolean isImage = contentType != null && contentType.startsWith("image/");
        boolean isVideo =
                "video/mp4".equals(contentType) ||
                "video/webm".equals(contentType) ||
                "video/quicktime".equals(contentType) ||
                "video/x-msvideo".equals(contentType) ||
                "video/x-matroska".equals(contentType);

        if (!isImage && !isVideo) {
            log.error("Unsupported file type: {}", contentType);
            throw new RuntimeException("Only image or video files allowed");
        }

        String original = StringUtils.cleanPath(
                originalFilename == null ? "media" : originalFilename
        );

        String safeName = sanitize(original);
        String publicId = UUID.randomUUID() + "_" + removeExtension(safeName);
        String resourceType = isVideo ? "video" : "image";

        log.info("Sanitized filename: {}", safeName);
        log.info("Generated public ID: {}", publicId);
        log.info("Cloudinary resource type: {}", resourceType);

        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", resourceType
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> result =
                    (isVideo || fileSize > LARGE_FILE_LIMIT)
                            ? cloudinary.uploader().uploadLarge(
                                    file.getInputStream(),
                                    ObjectUtils.asMap(
                                            "folder", folder,
                                            "public_id", publicId,
                                            "resource_type", resourceType,
                                            "chunk_size", 6000000
                                    )
                              )
                            : cloudinary.uploader().upload(
                                    file.getBytes(),
                                    options
                              );

            log.info("Cloudinary raw response keys: {}", result.keySet());

            String fileUrl = (String) result.get("secure_url");
            String cloudinaryPublicId = (String) result.get("public_id");
            String returnedResourceType = String.valueOf(result.get("resource_type"));

            log.info("Cloudinary secure_url: {}", fileUrl);
            log.info("Cloudinary public_id: {}", cloudinaryPublicId);
            log.info("Cloudinary resource_type returned: {}", returnedResourceType);

            if (fileUrl == null || fileUrl.isBlank()) {
                log.error("Cloudinary response without secure_url: {}", result);
                throw new RuntimeException("Cloudinary did not return file URL");
            }

            log.info("Upload successful");
            log.info("========== Cloudinary Upload Finished ==========");

            return new UploadResult(fileUrl, cloudinaryPublicId, returnedResourceType);

        } catch (IOException e) {
            log.error("Upload failed due to IOException: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String publicId, String resourceType) {
        if (publicId == null || publicId.isBlank()) {
            log.warn("Delete skipped: publicId is null or blank");
            return;
        }

        String finalResourceType =
                resourceType == null || resourceType.isBlank()
                        ? "image"
                        : resourceType;

        log.info("========== Cloudinary Delete Started ==========");
        log.info("Deleting publicId: {}", publicId);
        log.info("Deleting resourceType: {}", finalResourceType);

        try {
            Map<?, ?> result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", finalResourceType)
            );

            log.info("Cloudinary delete response: {}", result);
            log.info("========== Cloudinary Delete Finished ==========");

        } catch (Exception e) {
            log.error(
                    "Failed to delete file from Cloudinary. publicId: {}, resourceType: {}, error: {}",
                    publicId,
                    finalResourceType,
                    e.getMessage(),
                    e
            );
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    public void deleteFile(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            log.warn("Delete skipped: publicId is null or blank");
            return;
        }

        log.info("========== Cloudinary Delete Started ==========");
        log.info("Trying delete as image and video. publicId: {}", publicId);

        try {
            Map<?, ?> imageResult = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "image")
            );

            log.info("Image delete response: {}", imageResult);

            Map<?, ?> videoResult = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "video")
            );

            log.info("Video delete response: {}", videoResult);
            log.info("========== Cloudinary Delete Finished ==========");

        } catch (Exception e) {
            log.error(
                    "Failed to delete file from Cloudinary. publicId: {}, error: {}",
                    publicId,
                    e.getMessage(),
                    e
            );
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    private String sanitize(String name) {
        if (name == null || name.isBlank()) {
            return "media";
        }

        String cleaned = Normalizer.normalize(name, Normalizer.Form.NFKC);
        cleaned = cleaned.replaceAll("[\\r\\n]", "");
        cleaned = cleaned.replaceAll("[^a-zA-Z0-9._-]", "_");

        if (cleaned.isBlank()) {
            return "media";
        }

        return cleaned;
    }

    private String removeExtension(String filename) {
        if (filename == null || filename.isBlank()) {
            return "media";
        }

        int lastDot = filename.lastIndexOf(".");
        if (lastDot > 0) {
            return filename.substring(0, lastDot);
        }

        return filename;
    }

    public record UploadResult(
            String imageUrl,
            String publicId,
            String resourceType
    ) {}
}