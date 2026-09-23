package com.khelp.community.controller;

import com.khelp.common.dto.ApiResponse;
import com.khelp.common.dto.PageResponse;
import com.khelp.community.dto.CommentRequest;
import com.khelp.community.dto.CommentResponse;
import com.khelp.community.dto.PostRequest;
import com.khelp.community.dto.PostResponse;
import com.khelp.community.dto.ReportRequest;
import com.khelp.community.dto.ReportResponse;
import com.khelp.community.entity.PostCategory;
import com.khelp.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Community forum endpoints: posts, comments, likes and reports.
 */
@Tag(name = "Community", description = "Forum posts, comments, likes and reporting")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @Operation(summary = "List posts with optional category and keyword filters")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> listPosts(
            @RequestParam(required = false) PostCategory category,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                ApiResponse.ok(communityService.listPosts(category, q, page, size)));
    }

    @Operation(summary = "Get a single post and increment its view count")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.getPost(id)));
    }

    @Operation(summary = "Create a post")
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Post created", communityService.createPost(request)));
    }

    @Operation(summary = "Update a post you own (admins may update any post)")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id, @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok("Post updated", communityService.updatePost(id, request)));
    }

    @Operation(summary = "Soft-delete a post you own")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        communityService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.ok("Post deleted", null));
    }

    @Operation(summary = "Like or unlike a post")
    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<PostResponse>> toggleLike(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.toggleLike(id)));
    }

    @Operation(summary = "List comments for a post, including nested replies")
    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> listComments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.listComments(id)));
    }

    @Operation(summary = "Add a comment or reply to a post")
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id, @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Comment added", communityService.addComment(id, request)));
    }

    @Operation(summary = "Delete a comment you own")
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long commentId) {
        communityService.deleteComment(commentId);
        return ResponseEntity.ok(ApiResponse.ok("Comment deleted", null));
    }

    @Operation(summary = "Report a post, comment, listing or member")
    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<ReportResponse>> submitReport(
            @Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Report submitted", communityService.submitReport(request)));
    }
}
