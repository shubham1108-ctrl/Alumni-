package com.campusconnect.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderEmail;
    private String senderName;
    private String recipientEmail; // Null for public chat
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime timestamp;
    private boolean isPublic;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
