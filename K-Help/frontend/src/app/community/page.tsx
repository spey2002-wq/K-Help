"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { PageResponse, Post, PostCategory } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { humanize, timeAgo } from "@/lib/utils";

const CATEGORIES: PostCategory[] = [
  "GENERAL",
  "VISA_IMMIGRATION",
  "JOBS",
  "HOUSING",
  "HEALTHCARE",
  "BANKING",
  "EDUCATION",
  "LANGUAGE_EXCHANGE",
  "MARKETPLACE",
  "EMERGENCY",
];

export default function CommunityPage() {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<PageResponse<Post> | null>(null);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "", category: "GENERAL" as PostCategory });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(
        await api.community.list({
          page,
          size: 10,
          category: category || undefined,
          q: query || undefined,
        }),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, category, query]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate() {
    if (!draft.title.trim() || !draft.content.trim()) return;

    setSubmitting(true);
    try {
      await api.community.create(draft);
      setDraft({ title: "", content: "", category: "GENERAL" });
      setComposerOpen(false);
      setPage(0);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(id: number) {
    if (!isAuthenticated) return;
    try {
      const updated = await api.community.toggleLike(id);
      setPosts((previous) =>
        previous
          ? {
              ...previous,
              content: previous.content.map((post) => (post.id === id ? updated : post)),
            }
          : previous,
      );
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ask questions and share experience with other foreign residents.
          </p>
        </div>
        {isAuthenticated ? (
          <Button onClick={() => setComposerOpen((open) => !open)}>
            {composerOpen ? "Cancel" : "New post"}
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="outline">Sign in to post</Button>
          </Link>
        )}
      </div>

      {composerOpen && (
        <div className="card space-y-4 p-6">
          <h2 className="font-semibold text-slate-900">Create a post</h2>
          <Input
            label="Title"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="What would you like to discuss?"
          />
          <Select
            label="Category"
            value={draft.category}
            onChange={(event) =>
              setDraft({ ...draft, category: event.target.value as PostCategory })
            }
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {humanize(value)}
              </option>
            ))}
          </Select>
          <Textarea
            label="Content"
            value={draft.content}
            onChange={(event) => setDraft({ ...draft, content: event.target.value })}
            placeholder="Share the details..."
          />
          <div className="flex justify-end">
            <Button onClick={handleCreate} loading={submitting}>
              Publish
            </Button>
          </div>
        </div>
      )}

      <div className="card flex flex-wrap items-end gap-3 p-4">
        <Input
          label="Search"
          className="min-w-[200px] flex-1"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setPage(0);
              setQuery(searchInput.trim());
            }
          }}
          placeholder="Search titles and content"
        />
        <Select
          label="Category"
          className="w-48"
          value={category}
          onChange={(event) => {
            setPage(0);
            setCategory(event.target.value);
          }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {humanize(value)}
            </option>
          ))}
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setPage(0);
            setQuery(searchInput.trim());
          }}
        >
          Search
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading ? (
        <LoadingState message="Loading posts..." />
      ) : !posts || posts.content.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to start a discussion in this category."
        />
      ) : (
        <>
          <div className="space-y-3">
            {posts.content.map((post) => (
              <article key={post.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="brand">{humanize(post.category)}</Badge>
                      {post.pinned && <Badge tone="amber">Pinned</Badge>}
                    </div>
                    <Link
                      href={`/community/${post.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.content}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      by {post.authorFullName || post.authorUsername} · {timeAgo(post.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2 text-xs text-slate-500">
                    <span>{post.viewCount} views</span>
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      disabled={!isAuthenticated}
                      className="rounded-lg px-2 py-1 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ♥ {post.likeCount}
                    </button>
                    <span>{post.commentCount} comments</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination page={posts.page} totalPages={posts.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
