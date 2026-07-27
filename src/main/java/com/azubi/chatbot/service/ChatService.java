package com.azubi.chatbot.service;

import com.azubi.chatbot.dto.ChatRequestDto;
import com.azubi.chatbot.dto.ChatResponseDto;
import com.azubi.chatbot.model.ChatMessage;
import com.azubi.chatbot.repository.ChatHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@Service
public class ChatService {
    private final ClaudeApiService claudeApiService;
    private final ChatHistoryRepository chatHistoryRepository;

    public ChatService(ClaudeApiService claudeApiService, ChatHistoryRepository chatHistoryRepository) {
        this.claudeApiService = claudeApiService;
        this.chatHistoryRepository = chatHistoryRepository;
    }

    public ChatResponseDto processMessage(ChatRequestDto request) {
        
        List<ChatMessage> verlauf = chatHistoryRepository
            .findLatestMessages(PageRequest.of(0, 10));

        java.util.Collections.reverse(verlauf);

        String antwort = claudeApiService.sendMessage(verlauf, request.getMessage(), request.getImageBase64(), request.getImageMediaType());

        ChatMessage nutzerNachricht = new ChatMessage();
        nutzerNachricht.setRole("user");
        nutzerNachricht.setContent(request.getMessage());
        chatHistoryRepository.save(nutzerNachricht);

        ChatMessage assistantNachricht = new ChatMessage();
        assistantNachricht.setRole("assistant"); 
        assistantNachricht.setContent(antwort);
        chatHistoryRepository.save(assistantNachricht);

        return new ChatResponseDto(antwort);
    }
}

