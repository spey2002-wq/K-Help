package com.khelp.community.service;

import com.khelp.auth.entity.User;
import com.khelp.auth.repository.UserRepository;
import com.khelp.common.dto.PageResponse;
import com.khelp.common.exception.ApiException;
import com.khelp.community.dto.CommentRequest;
import com.khelp.community.dto.CommentResponse;
import com.khelp.community.dto.PostRequest;
import com.khelp.community.dto.PostResponse;
import com.khelp.community.dto.ReportRequest;
import com.khelp.community.dto.ReportResponse;
import com.khelp.community.entity.Comment;
import com.khelp.community.entity.Post;
import com.khelp.community.entity.PostCategory;
import com.khelp.community.entity.PostLike;
import com.khelp.community.entity.Report;
import com.khelp.community.entity.ReportStatus;
import com.khelp.community.repository.CommentRepository;
import com.khelp.community.repository.PostLikeRepository;
import com.khelp.community.repository.PostRepository;
import com.khelp.community.repository.ReportRepository;
import com.khelp.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Community forum: posts, comments, likes and reporting.
 */
@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    // ---------------------------------------------------------------- posts

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> listPosts(
            PostCategory category, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "pinned").and(Sort.by(Sort.Direction.DESC, "createdAt")));

        Page<Post> posts = postRepository.search(category, query, pageable);
        return PageResponse.from(posts.map(PostResponse::from));
    }

    @Transactional
    public PostResponse getPost(Long id) {
        Post post = requirePost(id);
        postRepository.incrementViewCount(id);
        post.setViewCount(post.getViewCount() + 1);
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse createPost(PostRequest request) {
        User author = requireCurrentUser();

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .author(author)
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = requirePost(id);
        assertOwnerOrAdmin(post.getAuthor().getUsername());

        post.setTitle(request.title());
        post.setContent(request.content());
        post.setCategory(request.category());

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = requirePost(id);
        assertOwnerOrAdmin(post.getAuthor().getUsername());

        // Soft delete keeps comment threads and audit history intact.
        post.setDeleted(true);
        postRepository.save(post);
    }

    @Transactional
    public PostResponse toggleLike(Long postId) {
        User user = requireCurrentUser();
        Post post = requirePost(postId);

        var existing = postLikeRepository.findByPostIdAndUserId(postId, user.getId());
        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            postLikeRepository.save(PostLike.builder().post(post).user(user).build());
            post.setLikeCount(post.getLikeCount() + 1);
        }

        return PostResponse.from(postRepository.save(post));
    }

    // ------------------------------------------------------------- comments

    @Transactional(readOnly = true)
    public List<CommentResponse> listComments(Long postId) {
        requirePost(postId);

        List<Comment> all = commentRepository.findByPostIdAndDeletedFalseOrderByCreatedAtAsc(postId);

        // Build the nested tree: top-level comments each carry their direct replies.
        return all.stream()
                .filter(comment -> comment.getParent() == null)
                .map(comment -> CommentResponse.from(comment, all.stream()
                        .filter(reply -> reply.getParent() != null
                                && reply.getParent().getId().equals(comment.getId()))
                        .map(CommentResponse::from)
                        .toList()))
                .toList();
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        User author = requireCurrentUser();
        Post post = requirePost(postId);

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> ApiException.notFound("Parent comment"));
        }

        Comment comment = Comment.builder()
                .content(request.content())
                .post(post)
                .author(author)
                .parent(parent)
                .build();

        Comment saved = commentRepository.save(comment);
        postRepository.incrementCommentCount(postId);

        return CommentResponse.from(saved);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> ApiException.notFound("Comment"));
        assertOwnerOrAdmin(comment.getAuthor().getUsername());

        comment.setDeleted(true);
        commentRepository.save(comment);
        postRepository.decrementCommentCount(comment.getPost().getId());
    }

    // -------------------------------------------------------------- reports

    @Transactional
    public ReportResponse submitReport(ReportRequest request) {
        User reporter = requireCurrentUser();

        Report report = Report.builder()
                .targetType(request.targetType())
                .targetId(request.targetId())
                .reason(request.reason())
                .details(request.details())
                .reporter(reporter)
                .status(ReportStatus.PENDING)
                .build();

        return ReportResponse.from(reportRepository.save(report));
    }

    // -------------------------------------------------------------- helpers

    private Post requirePost(Long id) {
        return postRepository.findById(id)
                .filter(post -> !post.isDeleted())
                .orElseThrow(() -> ApiException.notFound("Post"));
    }

    private User requireCurrentUser() {
        return userRepository.findByUsername(SecurityUtils.currentUsername())
                .orElseThrow(() -> ApiException.notFound("User"));
    }

    private void assertOwnerOrAdmin(String ownerUsername) {
        if (!ownerUsername.equals(SecurityUtils.currentUsername())
                && !SecurityUtils.hasRole("ADMIN")) {
            throw ApiException.forbidden("You can only modify your own content");
        }
    }
}
