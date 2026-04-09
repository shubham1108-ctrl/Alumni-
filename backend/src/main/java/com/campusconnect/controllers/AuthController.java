package com.campusconnect.controllers;

import com.campusconnect.dto.AuthDto.*;
import com.campusconnect.dto.ErrorResponse;
import com.campusconnect.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping({"/signin", "/login"})
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(500, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        try {
            JwtResponse response = authService.register(signUpRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already in use")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse(409, e.getMessage()));
            }
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(400, e.getMessage()));
        }
    }
}
