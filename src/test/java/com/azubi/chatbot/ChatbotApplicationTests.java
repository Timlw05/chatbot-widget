package com.azubi.chatbot;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "claude.api.key=test-key",
    "claude.model=claude-sonnet-4-20250514"
})
class ChatbotApplicationTests {

    @Test
    void contextLoads() {
    }
}