package com.campusconnect.controllers;

import com.campusconnect.dto.ProfileDto;
import com.campusconnect.models.User;
import com.campusconnect.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping({"", "/get"})
    public ResponseEntity<User> getMyProfile() {
        String email = getCurrentUserEmail();
        User user = profileService.getProfile(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping({"", "/update"})
    public ResponseEntity<User> updateProfile(@RequestBody ProfileDto profileDto) {
        String email = getCurrentUserEmail();
        User user = profileService.updateProfile(email, profileDto);
        return ResponseEntity.ok(user);
    }

    private String getCurrentUserEmail() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}
