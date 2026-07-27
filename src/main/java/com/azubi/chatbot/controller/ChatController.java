package com.azubi.chatbot.controller;

import com.azubi.chatbot.repository.ChatHistoryRepository;
import com.azubi.chatbot.dto.ChatRequestDto;
import com.azubi.chatbot.dto.ChatResponseDto;
import com.azubi.chatbot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final ChatHistoryRepository chatHistoryRepository;
    private final ChatService chatService;

    public ChatController(ChatService chatService, ChatHistoryRepository chatHistoryRepository) {
        this.chatService = chatService;
        this.chatHistoryRepository = chatHistoryRepository;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(@RequestBody ChatRequestDto request) {

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ChatResponseDto response = chatService.processMessage(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearChat() {
        chatHistoryRepository.deleteAll();
        return ResponseEntity.ok().build();
}
}
