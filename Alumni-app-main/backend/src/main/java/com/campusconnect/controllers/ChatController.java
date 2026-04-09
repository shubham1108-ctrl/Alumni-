package com.campusconnect.controllers;

import com.campusconnect.models.ChatMessage;
import com.campusconnect.models.User;
import com.campusconnect.repositories.ChatMessageRepository;
import com.campusconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/public")
    public ResponseEntity<List<ChatMessage>> getPublicMessages() {
        return ResponseEntity.ok(chatMessageRepository.findByIsPublicTrueOrderByTimestampAsc());
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        
        User user = userRepository.findByEmail(email).orElseThrow();
        
        message.setSenderEmail(email);
        message.setSenderName(user.getFullName());
        message.setPublic(true); // Default to public for now
        
        return ResponseEntity.ok(chatMessageRepository.save(message));
    }
}
