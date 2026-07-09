package com.mydev.ecommerce.instagram.dto;

public class InstagramMediaItemDto {

    private String id;
    private String mediaType;
    private String mediaUrl;
    private String thumbnailUrl;
    private String alt;
    private boolean video;

    public InstagramMediaItemDto() {
    }

    public InstagramMediaItemDto(
            String id,
            String mediaType,
            String mediaUrl,
            String thumbnailUrl,
            String alt,
            boolean video
    ) {
        this.id = id;
        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.alt = alt;
        this.video = video;
    }

    public String getId() {
        return id;
    }

    public String getMediaType() {
        return mediaType;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getAlt() {
        return alt;
    }

    public boolean isVideo() {
        return video;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public void setAlt(String alt) {
        this.alt = alt;
    }

    public void setVideo(boolean video) {
        this.video = video;
    }
}