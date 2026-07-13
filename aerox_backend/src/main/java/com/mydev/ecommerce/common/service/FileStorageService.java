
// package com.mydev.ecommerce.common.service;

// import com.cloudinary.Cloudinary;
// import com.cloudinary.utils.ObjectUtils;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.stereotype.Service;
// import org.springframework.util.StringUtils;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.text.Normalizer;
// import java.util.Map;
// import java.util.UUID;

// @Service
// public class FileStorageService {

//     private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

//     private static final long LARGE_FILE_LIMIT = 10L * 1024L * 1024L; // 10MB

//     private final Cloudinary cloudinary;

//     public FileStorageService(Cloudinary cloudinary) {
//         this.cloudinary = cloudinary;
//     }

//     public UploadResult saveFile(MultipartFile file) throws IOException {
//         return saveFile(file, "trendz-firenze/products");
//     }

//     public UploadResult saveGiftBoxFile(MultipartFile file) throws IOException {
//         return saveFile(file, "trendz-firenze/gift-boxes");
//     }

//     public UploadResult saveBrandShowcaseFile(MultipartFile file) throws IOException {
//         return saveFile(file, "trendz-firenze/brand-showcases");
//     }


//     public UploadResult saveCategoryFile(MultipartFile file) throws IOException {
//     return saveFile(file, "trendz-firenze/categories");
// }



//     public UploadResult saveFile(MultipartFile file, String folder) throws IOException {

//         log.info("========== Cloudinary Upload Started ==========");

//         if (file == null) {
//             throw new RuntimeException("File is null");
//         }

//         if (file.isEmpty()) {
//             throw new RuntimeException("File is empty");
//         }

//         String originalFilename = file.getOriginalFilename();
//         String contentType = file.getContentType();
//         long fileSize = file.getSize();

//         log.info("Original filename: {}", originalFilename);
//         log.info("Content type: {}", contentType);
//         log.info("File size: {} bytes", fileSize);
//         log.info("Upload folder: {}", folder);

//         boolean isImage = contentType != null && contentType.startsWith("image/");
//         boolean isVideo =
//                 "video/mp4".equals(contentType) ||
//                 "video/webm".equals(contentType) ||
//                 "video/quicktime".equals(contentType) ||
//                 "video/x-msvideo".equals(contentType) ||
//                 "video/x-matroska".equals(contentType);

//         if (!isImage && !isVideo) {
//             log.error("Unsupported file type: {}", contentType);
//             throw new RuntimeException("Only image or video files allowed");
//         }

//         String original = StringUtils.cleanPath(
//                 originalFilename == null ? "media" : originalFilename
//         );

//         String safeName = sanitize(original);
//         String publicId = UUID.randomUUID() + "_" + removeExtension(safeName);
//         String resourceType = isVideo ? "video" : "image";

//         log.info("Sanitized filename: {}", safeName);
//         log.info("Generated public ID: {}", publicId);
//         log.info("Cloudinary resource type: {}", resourceType);

//         try {
//             Map<String, Object> options = ObjectUtils.asMap(
//                     "folder", folder,
//                     "public_id", publicId,
//                     "resource_type", resourceType
//             );

//             @SuppressWarnings("unchecked")
//             Map<String, Object> result =
//                     (isVideo || fileSize > LARGE_FILE_LIMIT)
//                             ? cloudinary.uploader().uploadLarge(
//                                     file.getInputStream(),
//                                     ObjectUtils.asMap(
//                                             "folder", folder,
//                                             "public_id", publicId,
//                                             "resource_type", resourceType,
//                                             "chunk_size", 6000000
//                                     )
//                               )
//                             : cloudinary.uploader().upload(
//                                     file.getBytes(),
//                                     options
//                               );

//             log.info("Cloudinary raw response keys: {}", result.keySet());

//             String fileUrl = (String) result.get("secure_url");
//             String cloudinaryPublicId = (String) result.get("public_id");
//             String returnedResourceType = String.valueOf(result.get("resource_type"));

//             log.info("Cloudinary secure_url: {}", fileUrl);
//             log.info("Cloudinary public_id: {}", cloudinaryPublicId);
//             log.info("Cloudinary resource_type returned: {}", returnedResourceType);

//             if (fileUrl == null || fileUrl.isBlank()) {
//                 log.error("Cloudinary response without secure_url: {}", result);
//                 throw new RuntimeException("Cloudinary did not return file URL");
//             }

//             log.info("Upload successful");
//             log.info("========== Cloudinary Upload Finished ==========");

//             return new UploadResult(fileUrl, cloudinaryPublicId, returnedResourceType);

//         } catch (IOException e) {
//             log.error("Upload failed due to IOException: {}", e.getMessage(), e);
//             throw e;
//         } catch (Exception e) {
//             log.error("Cloudinary upload failed: {}", e.getMessage(), e);
//             throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
//         }
//     }

//     public void deleteFile(String publicId, String resourceType) {
//         if (publicId == null || publicId.isBlank()) {
//             log.warn("Delete skipped: publicId is null or blank");
//             return;
//         }

//         String finalResourceType =
//                 resourceType == null || resourceType.isBlank()
//                         ? "image"
//                         : resourceType;

//         log.info("========== Cloudinary Delete Started ==========");
//         log.info("Deleting publicId: {}", publicId);
//         log.info("Deleting resourceType: {}", finalResourceType);

//         try {
//             Map<?, ?> result = cloudinary.uploader().destroy(
//                     publicId,
//                     ObjectUtils.asMap("resource_type", finalResourceType)
//             );

//             log.info("Cloudinary delete response: {}", result);
//             log.info("========== Cloudinary Delete Finished ==========");

//         } catch (Exception e) {
//             log.error(
//                     "Failed to delete file from Cloudinary. publicId: {}, resourceType: {}, error: {}",
//                     publicId,
//                     finalResourceType,
//                     e.getMessage(),
//                     e
//             );
//             throw new RuntimeException("Failed to delete file from Cloudinary", e);
//         }
//     }

//     public void deleteFile(String publicId) {
//         if (publicId == null || publicId.isBlank()) {
//             log.warn("Delete skipped: publicId is null or blank");
//             return;
//         }

//         log.info("========== Cloudinary Delete Started ==========");
//         log.info("Trying delete as image and video. publicId: {}", publicId);

//         try {
//             Map<?, ?> imageResult = cloudinary.uploader().destroy(
//                     publicId,
//                     ObjectUtils.asMap("resource_type", "image")
//             );

//             log.info("Image delete response: {}", imageResult);

//             Map<?, ?> videoResult = cloudinary.uploader().destroy(
//                     publicId,
//                     ObjectUtils.asMap("resource_type", "video")
//             );

//             log.info("Video delete response: {}", videoResult);
//             log.info("========== Cloudinary Delete Finished ==========");

//         } catch (Exception e) {
//             log.error(
//                     "Failed to delete file from Cloudinary. publicId: {}, error: {}",
//                     publicId,
//                     e.getMessage(),
//                     e
//             );
//             throw new RuntimeException("Failed to delete file from Cloudinary", e);
//         }
//     }

//     private String sanitize(String name) {
//         if (name == null || name.isBlank()) {
//             return "media";
//         }

//         String cleaned = Normalizer.normalize(name, Normalizer.Form.NFKC);
//         cleaned = cleaned.replaceAll("[\\r\\n]", "");
//         cleaned = cleaned.replaceAll("[^a-zA-Z0-9._-]", "_");

//         if (cleaned.isBlank()) {
//             return "media";
//         }

//         return cleaned;
//     }

//     private String removeExtension(String filename) {
//         if (filename == null || filename.isBlank()) {
//             return "media";
//         }

//         int lastDot = filename.lastIndexOf(".");
//         if (lastDot > 0) {
//             return filename.substring(0, lastDot);
//         }

//         return filename;
//     }

//     public record UploadResult(
//             String imageUrl,
//             String publicId,
//             String resourceType
//     ) {}
// }













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