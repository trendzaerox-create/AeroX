
package com.mydev.ecommerce.common.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log =
            LoggerFactory.getLogger(FileStorageService.class);

    private static final long MAX_FILE_SIZE =
            100L * 1024L * 1024L;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif"
    );

    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska"
    );

    private final Path uploadRoot;
    private final String publicBaseUrl;

    public FileStorageService(
            @Value("${app.storage.upload-dir:/app/uploads}")
            String uploadDirectory,

            @Value("${app.storage.public-base-url:https://api.trendzaerox.com/uploads}")
            String publicBaseUrl
    ) {
        this.uploadRoot = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        this.publicBaseUrl =
                normalizePublicBaseUrl(publicBaseUrl);
    }

    @PostConstruct
    public void initializeStorage() {

        try {
            Files.createDirectories(uploadRoot);

            if (!Files.isDirectory(uploadRoot)) {
                throw new IllegalStateException(
                        "Upload path is not a directory: "
                                + uploadRoot
                );
            }

            if (!Files.isWritable(uploadRoot)) {
                throw new IllegalStateException(
                        "Upload directory is not writable: "
                                + uploadRoot
                );
            }

            log.info(
                    "Local file storage initialized at: {}",
                    uploadRoot
            );

            log.info(
                    "Public media base URL: {}",
                    publicBaseUrl
            );

        } catch (IOException e) {
            throw new IllegalStateException(
                    "Could not initialize upload directory: "
                            + uploadRoot,
                    e
            );
        }
    }

    public UploadResult saveFile(
            MultipartFile file
    ) throws IOException {

        return saveFile(
                file,
                "trendz-aerox/products"
        );
    }

    public UploadResult saveGiftBoxFile(
            MultipartFile file
    ) throws IOException {

        return saveFile(
                file,
                "trendz-aerox/gift-boxes"
        );
    }

    public UploadResult saveBrandShowcaseFile(
            MultipartFile file
    ) throws IOException {

        return saveFile(
                file,
                "trendz-aerox/brand-showcases"
        );
    }

    public UploadResult saveCategoryFile(
            MultipartFile file
    ) throws IOException {

        return saveFile(
                file,
                "trendz-aerox/categories"
        );
    }

    public UploadResult saveFile(
            MultipartFile file,
            String folder
    ) throws IOException {

        log.info("========== Local Upload Started ==========");

        validateFile(file);

        String contentType = file
                .getContentType()
                .toLowerCase(Locale.ROOT);

        boolean video =
                ALLOWED_VIDEO_TYPES.contains(contentType);

        String resourceType =
                video ? "video" : "image";

        Path relativeFolder =
                validateFolder(folder);

        Path destinationDirectory = uploadRoot
                .resolve(relativeFolder)
                .normalize();

        ensureInsideUploadRoot(destinationDirectory);

        Files.createDirectories(destinationDirectory);

        if (!Files.isWritable(destinationDirectory)) {
            throw new IOException(
                    "Upload directory is not writable: "
                            + destinationDirectory
            );
        }

        String extension =
                extensionForContentType(contentType);

        String generatedFilename =
                UUID.randomUUID() + extension;

        Path destinationFile = destinationDirectory
                .resolve(generatedFilename)
                .normalize();

        ensureInsideUploadRoot(destinationFile);

        log.info(
                "Original filename: {}",
                file.getOriginalFilename()
        );

        log.info(
                "Content type: {}",
                contentType
        );

        log.info(
                "File size: {} bytes",
                file.getSize()
        );

        log.info(
                "Destination file: {}",
                destinationFile
        );

        try (InputStream inputStream =
                     file.getInputStream()) {

            Files.copy(
                    inputStream,
                    destinationFile,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException exception) {

            log.error(
                    "Failed to save uploaded file to {}",
                    destinationFile,
                    exception
            );

            throw exception;
        }

        if (!Files.exists(destinationFile)) {
            throw new IOException(
                    "File copy completed but destination does not exist: "
                            + destinationFile
            );
        }

        String storageKey = uploadRoot
                .relativize(destinationFile)
                .toString()
                .replace('\\', '/');

        String publicUrl =
                publicBaseUrl + "/" + storageKey;

        log.info("Local upload successful");
        log.info("Storage key: {}", storageKey);
        log.info("Public URL: {}", publicUrl);
        log.info("========== Local Upload Finished ==========");

        return new UploadResult(
                publicUrl,
                storageKey,
                resourceType
        );
    }

    public void deleteFile(
            String publicId,
            String ignoredResourceType
    ) {
        deleteFile(publicId);
    }

    public void deleteFile(String publicId) {

        if (publicId == null || publicId.isBlank()) {
            log.warn(
                    "Delete skipped because storage key is blank"
            );

            return;
        }

        String storageKey =
                extractLocalStorageKey(publicId);

        if (storageKey == null || storageKey.isBlank()) {
            log.warn(
                    "Delete skipped because value is not a local upload: {}",
                    publicId
            );

            return;
        }

        Path filePath = uploadRoot
                .resolve(storageKey)
                .normalize();

        ensureInsideUploadRoot(filePath);

        try {
            boolean deleted =
                    Files.deleteIfExists(filePath);

            if (deleted) {
                log.info(
                        "Deleted local media file: {}",
                        filePath
                );
            } else {
                log.warn(
                        "Local media file was not found: {}",
                        filePath
                );
            }

        } catch (IOException exception) {

            log.error(
                    "Failed to delete local media file: {}",
                    filePath,
                    exception
            );

            throw new RuntimeException(
                    "Failed to delete local media file",
                    exception
            );
        }
    }

    private void validateFile(MultipartFile file) {

        if (file == null) {
            throw new IllegalArgumentException(
                    "Uploaded file is null"
            );
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Uploaded file is empty"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File exceeds maximum allowed size of 100MB"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                contentType.isBlank()) {

            throw new IllegalArgumentException(
                    "File content type is missing"
            );
        }

        String normalizedContentType =
                contentType.toLowerCase(Locale.ROOT);

        boolean allowed =
                ALLOWED_IMAGE_TYPES.contains(
                        normalizedContentType
                )
                        ||
                ALLOWED_VIDEO_TYPES.contains(
                        normalizedContentType
                );

        if (!allowed) {
            throw new IllegalArgumentException(
                    "Unsupported file type: "
                            + contentType
            );
        }
    }

    private Path validateFolder(String folder) {

        if (folder == null || folder.isBlank()) {
            return Paths.get("general");
        }

        String cleaned = Normalizer.normalize(
                        folder,
                        Normalizer.Form.NFKC
                )
                .replace('\\', '/')
                .replaceAll("^/+", "")
                .replaceAll("/+$", "");

        if (cleaned.isBlank()) {
            return Paths.get("general");
        }

        if (!cleaned.matches("[a-zA-Z0-9/_-]+")) {
            throw new IllegalArgumentException(
                    "Upload folder contains invalid characters"
            );
        }

        Path relativeFolder =
                Paths.get(cleaned).normalize();

        if (relativeFolder.isAbsolute()
                || relativeFolder.startsWith("..")) {

            throw new IllegalArgumentException(
                    "Invalid upload folder"
            );
        }

        return relativeFolder;
    }

    private void ensureInsideUploadRoot(Path path) {

        if (!path.startsWith(uploadRoot)) {
            throw new SecurityException(
                    "Invalid local storage path: "
                            + path
            );
        }
    }

    private String extractLocalStorageKey(
            String value
    ) {

        String normalized = value
                .trim()
                .replace('\\', '/');

        if (normalized.startsWith("http://")
                || normalized.startsWith("https://")) {

            URI uri;

            try {
                uri = URI.create(normalized);
            } catch (IllegalArgumentException exception) {

                log.warn(
                        "Invalid media URL received for deletion: {}",
                        value
                );

                return null;
            }

            String path = uri.getPath();

            if (path == null || path.isBlank()) {
                return null;
            }

            int uploadsIndex =
                    path.indexOf("/uploads/");

            if (uploadsIndex < 0) {
                /*
                 * This is probably an old Cloudinary URL.
                 * It must not be treated as a local file.
                 */
                return null;
            }

            normalized = path.substring(
                    uploadsIndex + "/uploads/".length()
            );

        } else {

            if (normalized.startsWith("/uploads/")) {
                normalized = normalized.substring(
                        "/uploads/".length()
                );
            } else if (normalized.startsWith("uploads/")) {
                normalized = normalized.substring(
                        "uploads/".length()
                );
            }
        }

        while (normalized.startsWith("/")) {
            normalized = normalized.substring(1);
        }

        if (normalized.isBlank()
                || normalized.contains("..")) {

            throw new IllegalArgumentException(
                    "Invalid storage key"
            );
        }

        return normalized;
    }

    private String normalizePublicBaseUrl(
            String value
    ) {

        String normalized =
                value == null || value.isBlank()
                        ? "https://api.trendzaerox.com/uploads"
                        : value.trim();

        while (normalized.endsWith("/")) {
            normalized = normalized.substring(
                    0,
                    normalized.length() - 1
            );
        }

        return normalized;
    }

    private String extensionForContentType(
            String contentType
    ) {

        return switch (contentType) {
            case "image/jpeg",
                 "image/jpg" -> ".jpg";

            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "image/avif" -> ".avif";

            case "video/mp4" -> ".mp4";
            case "video/webm" -> ".webm";
            case "video/quicktime" -> ".mov";
            case "video/x-msvideo" -> ".avi";
            case "video/x-matroska" -> ".mkv";

            default -> throw new IllegalArgumentException(
                    "Unsupported content type: "
                            + contentType
            );
        };
    }

    public record UploadResult(
            String imageUrl,
            String publicId,
            String resourceType
    ) {
    }
}