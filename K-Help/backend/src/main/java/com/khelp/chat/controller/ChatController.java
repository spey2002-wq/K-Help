package com.khelp.chat.controller;

import com.khelp.chat.dto.ChatMessageResponse;
import com.khelp.chat.dto.ConversationResponse;
import com.khelp.chat.dto.SendMessageRequest;
import com.khelp.chat.dto.StartConversationRequest;
import com.khelp.chat.service.ChatService;
import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST surface for chat. WebSocket clients can use these for history and
 * conversation setup, then stream live messages over STOMP.
 */
@Tag(name = "Chat", description = "Conversations, message history and read receipts")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @Operation(summary = "Start or reuse a one-to-one conversation")
    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<ConversationResponse>> startConversation(
            @Valid @RequestBody StartConversationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Conversation ready",
                        chatService.startConversation(request)));
    }

    @Operation(summary = "List the current member's conversations")
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<PageResponse<ConversationResponse>>> listConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.listConversations(page, size)));
    }

    @Operation(summary = "Get message history for a conversation")
    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<ChatMessageResponse>>> listMessages(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.listMessages(id, page, size)));
    }

    @Operation(summary = "Send a message over REST (also broadcast to WebSocket subscribers)")
    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @PathVariable Long id, @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Message sent", chatService.sendMessage(id, request)));
    }

    @Operation(summary = "Mark all messages in a conversation as read")
    @PostMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResponse<Integer>> markRead(@PathVariable Long id) {
        int updated = chatService.markRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Messages marked as read", updated));
    }
}
