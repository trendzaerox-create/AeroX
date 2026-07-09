



package com.mydev.ecommerce.instagram.dto;

import java.util.List;

public class InstagramPostsResponse {

    private List<InstagramPostDto> posts;

    public InstagramPostsResponse() {
    }

    public InstagramPostsResponse(List<InstagramPostDto> posts) {
        this.posts = posts;
    }

    public List<InstagramPostDto> getPosts() {
        return posts;
    }

    public void setPosts(List<InstagramPostDto> posts) {
        this.posts = posts;
    }
}