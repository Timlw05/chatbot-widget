package com.azubi.chatbot.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")

public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;  //"user" oder "assistant"

    @Column(columnDefinition = "TEXT")
    private String content; 

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public Long getId() { 
        return id;
    }
    public String getRole() { 
        return role;
    }
    public void setRole(String role) { 
        this.role = role;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
}
