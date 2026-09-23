"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import api, { errorMessage } from "@/lib/api";
import type { ChatMessage } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { useChatSocket } from "@/lib/use-chat-socket";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/Feedback";
import { cn, timeAgo } from "@/lib/utils";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const conversationId = Number(params.id);
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [translateTo, setTranslateTo] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const { connected, lastMessage, sendMessage } = useChatSocket(
    Number.isNaN(conversationId) ? null : conversationId,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const page = await api.chat.messages(conversationId, { page: 0, size: 50 });
      // The API returns newest-first for paging; reverse for display.
      setMessages([...page.content].reverse());
      await api.chat.markRead(conversationId);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!Number.isNaN(conversationId)) void load();
  }, [load, conversationId]);

  /** Appends messages arriving over STOMP, ignoring duplicates. */
  useEffect(() => {
    if (!lastMessage) return;
    setMessages((previous) =>
      previous.some((message) => message.id === lastMessage.id)
        ? previous
        : [...previous, lastMessage],
    );
  }, [lastMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const content = draft.trim();
    if (!content) return;

    const delivered = sendMessage(content, translateTo || undefined);

    if (!delivered) {
      // Fall back to REST when the socket is not connected yet.
      api.chat
        .send(conversationId, { content, targetLanguage: translateTo || undefined })
        .then((message) =>
          setMessages((previous) =>
            previous.some((existing) => existing.id === message.id)
              ? previous
              : [...previous, message],
          ),
        )
        .catch((err) => setError(errorMessage(err)));
    }

    setDraft("");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/chat" className="text-sm text-brand-600 hover:underline">
          ← All conversations
        </Link>
        <Badge tone={connected ? "green" : "amber"}>
          {connected ? "Live" : "Connecting..."}
        </Badge>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="card flex h-[65vh] flex-col">
        {loading ? (
          <LoadingState message="Loading messages..." />
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No messages yet. Say hello!
                </p>
              )}

              {messages.map((message) => {
                const mine = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        mine
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-800",
                      )}
                    >
                      {!mine && (
                        <p className="mb-1 text-xs font-medium opacity-70">
                          {message.senderUsername}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {message.translatedContent && (
                        <p
                          className={cn(
                            "mt-2 border-t pt-2 text-xs",
                            mine ? "border-white/25 text-brand-50" : "border-slate-300 text-slate-600",
                          )}
                        >
                          {message.translatedContent}
                        </p>
                      )}

                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          mine ? "text-brand-100" : "text-slate-500",
                        )}
                      >
                        {timeAgo(message.createdAt)}
                        {mine && message.readAt ? " · Read" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 p-4">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message... (Enter to send, Shift+Enter for a new line)"
                className="min-h-[70px]"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  Translate to
                  <select
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    value={translateTo}
                    onChange={(event) => setTranslateTo(event.target.value)}
                  >
                    <option value="">Off</option>
                    <option value="ko">Korean</option>
                    <option value="en">English</option>
                    <option value="ne">Nepali</option>
                    <option value="vi">Vietnamese</option>
                  </select>
                </label>

                <Button onClick={handleSend} disabled={!draft.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
