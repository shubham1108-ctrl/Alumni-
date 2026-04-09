package com.campusconnect.controllers;

import com.campusconnect.models.ConnectionRequest;
import com.campusconnect.models.User;
import com.campusconnect.repositories.ConnectionRequestRepository;
import com.campusconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionRequestRepository connectionRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/request/{toUserId}")
    public ResponseEntity<?> sendConnectionRequest(@PathVariable Long toUserId) {
        User fromUser = getCurrentUser();

        if (fromUser.getId().equals(toUserId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot connect to yourself"));
        }

        // Check for duplicate
        if (connectionRequestRepository.findByFromUserIdAndToUserId(fromUser.getId(), toUserId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Connection request already sent"));
        }

        ConnectionRequest request = new ConnectionRequest();
        request.setFromUserId(fromUser.getId());
        request.setToUserId(toUserId);
        request.setStatus(ConnectionRequest.Status.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        connectionRequestRepository.save(request);
        return ResponseEntity.ok(Map.of("message", "Connection request sent"));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ConnectionRequest>> getSentRequests() {
        User user = getCurrentUser();
        List<ConnectionRequest> requests = connectionRequestRepository.findByFromUserId(user.getId());
        return ResponseEntity.ok(requests);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
