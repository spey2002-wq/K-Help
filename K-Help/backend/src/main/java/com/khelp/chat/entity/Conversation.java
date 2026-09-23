package com.khelp.chat.entity;

import com.khelp.auth.entity.User;
import com.khelp.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A one-to-one conversation between two members.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conversations", indexes = {
        @Index(name = "idx_conversations_participant_one", columnList = "participant_one_id"),
        @Index(name = "idx_conversations_participant_two", columnList = "participant_two_id")
})
public class Conversation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_one_id", nullable = false)
    private User participantOne;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_two_id", nullable = false)
    private User participantTwo;

    @Column(name = "last_message_preview", length = 300)
    private String lastMessagePreview;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    /** Denormalized counters keep the conversation list cheap to render. */
    @Column(name = "unread_count_one", nullable = false)
    @Builder.Default
    private long unreadCountOne = 0L;

    @Column(name = "unread_count_two", nullable = false)
    @Builder.Default
    private long unreadCountTwo = 0L;

    /** True when the conversation was opened from a job or housing listing. */
    @Column(name = "context_type", length = 20)
    private String contextType;

    @Column(name = "context_id")
    private Long contextId;

    public boolean includes(Long userId) {
        return participantOne.getId().equals(userId) || participantTwo.getId().equals(userId);
    }

    public User otherParticipant(Long userId) {
        return participantOne.getId().equals(userId) ? participantTwo : participantOne;
    }
}
