package com.khelp.chat.repository;

import com.khelp.chat.entity.Conversation;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
            SELECT c FROM Conversation c
            WHERE (c.participantOne.id = :userId OR c.participantTwo.id = :userId)
            ORDER BY c.lastMessageAt DESC NULLS LAST, c.createdAt DESC
            """)
    Page<Conversation> findAllForUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * Finds an existing one-to-one conversation regardless of participant order.
     */
    @Query("""
            SELECT c FROM Conversation c
            WHERE (c.participantOne.id = :userA AND c.participantTwo.id = :userB)
               OR (c.participantOne.id = :userB AND c.participantTwo.id = :userA)
            """)
    Optional<Conversation> findBetween(@Param("userA") Long userA, @Param("userB") Long userB);
}
