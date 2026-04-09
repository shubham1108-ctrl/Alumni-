package com.campusconnect.dto;

import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class SignupRequest {
        private String email;
        private String password;
        private String fullName;
        private String role;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private String email;
        private String fullName;
        private Long id;
        private String role;

        public JwtResponse(String token, String email, String fullName, Long id, String role) {
            this.token = token;
            this.email = email;
            this.fullName = fullName;
            this.id = id;
            this.role = role;
        }
    }
}
