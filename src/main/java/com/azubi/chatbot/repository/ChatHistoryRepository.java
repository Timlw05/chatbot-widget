package com.azubi.chatbot.repository;
import com.azubi.chatbot.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface ChatHistoryRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m ORDER BY m.timestamp ASC")
    List<ChatMessage> findLatestMessages(org.springframework.data.domain.Pageable pageable);
}

