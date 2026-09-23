"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { Comment, Post } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { humanize, timeAgo } from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postData, commentData] = await Promise.all([
        api.community.get(postId),
        api.community.comments(postId),
      ]);
      setPost(postData);
      setComments(commentData);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!Number.isNaN(postId)) void load();
  }, [load, postId]);

  async function handleComment() {
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await api.community.addComment(postId, {
        content: commentText.trim(),
        parentId: replyTo ?? undefined,
      });
      setCommentText("");
      setReplyTo(null);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.community.remove(postId);
      router.push("/community");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  if (loading) return <LoadingState message="Loading post..." />;
  if (error && !post) return <ErrorState message={error} onRetry={load} />;
  if (!post) return null;

  const canManage = user?.username === post.authorUsername || user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/community" className="text-sm text-brand-600 hover:underline">
        ← Back to community
      </Link>

      {error && <ErrorState message={error} />}

      <article className="card p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{humanize(post.category)}</Badge>
          {post.pinned && <Badge tone="amber">Pinned</Badge>}
          {post.locked && <Badge tone="slate">Locked</Badge>}
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          by {post.authorFullName || post.authorUsername} · {timeAgo(post.createdAt)} ·{" "}
          {post.viewCount} views
        </p>

        <div className="mt-6 whitespace-pre-wrap text-slate-700">{post.content}</div>

        {canManage && (
          <div className="mt-6 flex gap-2 border-t border-slate-200 pt-4">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete post
            </Button>
          </div>
        )}
      </article>

      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">
          Comments ({comments.length})
        </h2>

        {isAuthenticated ? (
          <div className="mt-4 space-y-3">
            {replyTo !== null && (
              <p className="text-xs text-slate-500">
                Replying to comment #{replyTo} ·{" "}
                <button
                  type="button"
                  className="text-brand-600 hover:underline"
                  onClick={() => setReplyTo(null)}
                >
                  cancel
                </button>
              </p>
            )}
            <Textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
              className="min-h-[90px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleComment} loading={submitting} size="sm">
                {replyTo !== null ? "Post reply" : "Post comment"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            <Link href="/login" className="text-brand-600 hover:underline">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        )}

        <div className="mt-6 space-y-5">
          {comments.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet.</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
              <p className="text-sm font-medium text-slate-800">
                {comment.authorFullName || comment.authorUsername}
                <span className="ml-2 font-normal text-xs text-slate-500">
                  {timeAgo(comment.createdAt)}
                </span>
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p>
              {isAuthenticated && (
                <button
                  type="button"
                  className="mt-1 text-xs text-brand-600 hover:underline"
                  onClick={() => setReplyTo(comment.id)}
                >
                  Reply
                </button>
              )}

              {comment.replies.length > 0 && (
                <div className="mt-3 space-y-3 border-l-2 border-slate-100 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <p className="text-sm font-medium text-slate-800">
                        {reply.authorFullName || reply.authorUsername}
                        <span className="ml-2 font-normal text-xs text-slate-500">
                          {timeAgo(reply.createdAt)}
                        </span>
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
