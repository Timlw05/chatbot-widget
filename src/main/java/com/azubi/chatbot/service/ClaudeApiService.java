package com.azubi.chatbot.service;

import com.azubi.chatbot.model.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClaudeApiService {
    
    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.model}")
    private String model;

    private final WebClient webClient;

    public ClaudeApiService() {
        this.webClient = WebClient.builder()
            .baseUrl("https://api.anthropic.com")
            .defaultHeader("anthropic-version", "2023-06-01")
            .defaultHeader("Content-Type", "application/json")
            .build();
    }
    
    @SuppressWarnings({"unchecked", "rawtypes"})
    public String sendMessage(List<ChatMessage> verlauf, String neueNachricht,
                          String imageBase64, String imageMediaType) {

    List<Map<String, Object>> messages = new ArrayList<>();

    for (ChatMessage msg : verlauf) {
        Map<String, Object> entry = new HashMap<>();
        entry.put("role", msg.getRole());
        entry.put("content", msg.getContent());
        messages.add(entry);
    }

    Map<String, Object> aktuelleNachricht = new HashMap<>();
    aktuelleNachricht.put("role", "user");

    if (imageBase64 != null && !imageBase64.isEmpty()) {
        
        List<Map<String, Object>> contentList = new ArrayList<>();

        Map<String, Object> imageBlock = new HashMap<>();
        imageBlock.put("type", "image");
        Map<String, Object> imageSource = new HashMap<>();
        imageSource.put("type", "base64");
        imageSource.put("media_type", imageMediaType);
        imageSource.put("data", imageBase64);
        imageBlock.put("source", imageSource);
        contentList.add(imageBlock);

        if (neueNachricht != null && !neueNachricht.isEmpty()) {
            Map<String, Object> textBlock = new HashMap<>();
            textBlock.put("type", "text");
            textBlock.put("text", neueNachricht);
            contentList.add(textBlock);
        }

        aktuelleNachricht.put("content", contentList);
    } else {
        aktuelleNachricht.put("content", neueNachricht);
    }

    messages.add(aktuelleNachricht);

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("model", model);
    requestBody.put("max_tokens", 1024);
    requestBody.put("messages", messages);
    requestBody.put("system", "Du bist Herbert, ein hilfreicher Assistent. " +
        "Erkenne automatisch die Sprache des Nutzers und antworte IMMER in genau dieser Sprache. " +
        "Benutze kein Markdown, keine Sterne, keine Rauten (#), keine Aufzählungszeichen. " +
        "Schreibe in normalem Fließtext.");

    Map response = webClient.post()
            .uri("/v1/messages")
            .header("x-api-key", apiKey)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

    List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
    return (String) content.get(0).get("text");
    }
}
