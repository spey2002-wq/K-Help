"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { tokenStore, WS_URL } from "@/lib/api";
import type { ChatMessage } from "@/types";

interface ReadReceipt {
  conversationId: number;
  readerId: number;
  readAt: string;
}

/**
 * Subscribes to a single conversation over STOMP and exposes helpers to send
 * messages and publish read receipts.
 *
 * <p>The client is only created in the browser and is torn down on unmount or
 * when the conversation id changes.
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

    const client = new Client({
      // SockJS handles the fallback transports that the backend endpoint exposes.
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${tokenStore.getAccessToken() ?? ""}`,
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
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
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
