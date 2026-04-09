package com.campusconnect.dto;

import lombok.Data;

public class PostDto {

    @Data
    public static class CreatePostRequest {
        private String content;
    }

    @Data
    public static class CommentRequest {
        private String content;
    }
}
