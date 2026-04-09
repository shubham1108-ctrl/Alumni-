package com.campusconnect.controllers;

import com.campusconnect.models.User;
import com.campusconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/suggestions")
    public ResponseEntity<List<User>> getSuggestions() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String currentEmail = userDetails.getUsername();

        // Get all users except current user, limit to 6 for suggestions
        List<User> suggestions = userRepository.findAll().stream()
                .filter(user -> !user.getEmail().equals(currentEmail))
                .limit(6)
                .collect(Collectors.toList());

        return ResponseEntity.ok(suggestions);
    }
}
