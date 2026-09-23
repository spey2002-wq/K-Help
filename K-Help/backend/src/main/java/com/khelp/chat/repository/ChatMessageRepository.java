package com.khelp.chat.repository;

import com.khelp.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);

    long countByConversationIdAndSenderIdNotAndReadAtIsNull(Long conversationId, Long senderId);

    @Modifying
    @Query("""
            UPDATE ChatMessage m SET m.readAt = CURRENT_TIMESTAMP
            WHERE m.conversation.id = :conversationId
              AND m.sender.id <> :readerId
              AND m.readAt IS NULL
            """)
    int markConversationRead(@Param("conversationId") Long conversationId,
                             @Param("readerId") Long readerId);
}
