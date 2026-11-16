"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { tokenStore, WS_URL } from "@/lib/api";
import type { ChatMessage } from "@/types";

interface ReadReceipt {
  conversationId: number;
  readerId: number;
  readAt: string;
}

/** SockJS wants http(s); native STOMP wants ws(s). Normalize either form. */
function toBrokerUrl(raw: string): string {
  if (raw.startsWith("https://")) return `wss://${raw.slice("https://".length)}`;
  if (raw.startsWith("http://")) return `ws://${raw.slice("http://".length)}`;
  return raw;
}

/**
 * Subscribes to a single conversation over STOMP and exposes helpers to send
 * messages and publish read receipts.
 *
 * Uses the native WebSocket endpoint on the API (`/ws`). Messages still work
 * over REST when this socket is not connected yet.
 */
export function useChatSocket(conversationId: number | null) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const [lastRead, setLastRead] = useState<ReadReceipt | null>(null);

  useEffect(() => {
    if (conversationId == null || typeof window === "undefined") {
      return;
    }

    const token = tokenStore.getAccessToken() ?? "";
    const client = new Client({
      brokerURL: toBrokerUrl(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/conversations/${conversationId}`, (frame: IMessage) => {
          setLastMessage(JSON.parse(frame.body) as ChatMessage);
        });

        client.subscribe(
          `/topic/conversations/${conversationId}/read`,
          (frame: IMessage) => {
            setLastRead(JSON.parse(frame.body) as ReadReceipt);
          },
        );
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: () => setConnected(false),
      onWebSocketError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      void client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content: string, targetLanguage?: string) => {
      const client = clientRef.current;
      if (!client?.connected || conversationId == null) return false;

      client.publish({
        destination: `/app/chat/${conversationId}/send`,
        body: JSON.stringify({ content, targetLanguage }),
      });
      return true;
    },
    [conversationId],
  );

  const sendReadReceipt = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected || conversationId == null) return;

    client.publish({
      destination: `/app/chat/${conversationId}/read`,
      body: JSON.stringify({}),
    });
  }, [conversationId]);

  return { connected, lastMessage, lastRead, sendMessage, sendReadReceipt };
}
