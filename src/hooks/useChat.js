import { useEffect, useRef, useState, useCallback } from "react";
import {
  fetchCurrentUserApi,
  fetchConversationByTicketIdApi,
  createConversationFromTicketApi,
  fetchMessagesApi,
  sendMessageApi,
  markMessageAsReadApi,
} from "./chat/chatDataApi";
import {
  sortMessagesChronologically,
  dedupeMessages,
  getReceiverIdFromParticipants,
  getUnreadIncomingMessages,
} from "./chat/messageUtils";
import {
  startConnection,
  stopConnection,
  joinConversation,
  leaveConversation,
  onReceiveMessage,
  onConversationUpdated,
  onMessageDelivered,
  onMessageRead,
  onConnectionStateChange,
  getConnectionState,
} from "./chat/chatHubClient";

export {
  startConnection,
  stopConnection,
  joinConversation,
  leaveConversation,
  onReceiveMessage,
  onConversationUpdated,
  onMessageDelivered,
  onMessageRead,
  onConnectionStateChange,
  getConnectionState,
};

export default function useChat(ticket) {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const initializedConversationIdRef = useRef(null);
  const isInitializingRef = useRef(false);
  const readInFlightRef = useRef(new Set());

  const safeSetState = useCallback((setter) => {
    if (mountedRef.current) setter();
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await fetchCurrentUserApi();

      safeSetState(() => {
        setCurrentUser(data);
      });

      return data;
    } catch (err) {
      console.warn("Could not fetch current user.");
      return null;
    }
  }, [safeSetState]);

  const fetchConversation = useCallback(async () => {
    if (!ticket?.id) {
      safeSetState(() => {
        setConversation(null);
        setMessages([]);
        setHasMore(false);
        setNextCursor(null);
        setLoadingInit(false);
      });
      return null;
    }

    try {
      setError(null);
      const data = await fetchConversationByTicketIdApi(ticket.id);

      safeSetState(() => {
        setConversation(data);
      });

      return data;
    } catch (err) {
      // 404 means no conversation exists yet — not a real error
      if (err?.response?.status === 404) {
        return null;
      }

      const msg =
        err?.response?.data?.ErrorMessage ||
        err?.message ||
        "Failed to load conversation.";

      safeSetState(() => {
        setError(msg);
        setConversation(null);
      });

      return null;
    }
  }, [safeSetState, ticket?.id]);

  const fetchMessages = useCallback(async (conversationId, cursor = null) => {
    try {
      return await fetchMessagesApi(conversationId, cursor);
    } catch (err) {
      console.warn("Failed to fetch messages:", err);
      return { msgs: [], nextCursor: null, hasMore: false };
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!messages.length || !currentUser) return;

    const unread = getUnreadIncomingMessages(
      messages,
      currentUser,
      readInFlightRef.current,
    );

    if (!unread.length) return;

    unread.forEach((msg) => readInFlightRef.current.add(msg.id));

    try {
      await Promise.allSettled(
        unread.map((msg) => markMessageAsReadApi(msg.id)),
      );
    } finally {
      unread.forEach((msg) => readInFlightRef.current.delete(msg.id));
    }
  }, [messages, currentUser]);

  const loadMore = useCallback(async () => {
    if (!conversation?.id || !hasMore || loadingMore) return;

    safeSetState(() => setLoadingMore(true));

    try {
      const {
        msgs,
        nextCursor: nc,
        hasMore: hm,
      } = await fetchMessages(conversation.id, nextCursor);

      safeSetState(() => {
        setMessages((prev) => {
          const merged = [...msgs, ...prev];
          return sortMessagesChronologically(dedupeMessages(merged));
        });

        setNextCursor(nc);
        setHasMore(hm);
      });
    } finally {
      safeSetState(() => setLoadingMore(false));
    }
  }, [
    conversation?.id,
    hasMore,
    loadingMore,
    nextCursor,
    fetchMessages,
    safeSetState,
  ]);

  const doSend = useCallback(
    async (text) => {
      if (!conversation?.id || !text.trim()) return;

      const participants = conversation.participants ?? [];
      const recieverId = getReceiverIdFromParticipants(conversation, currentUser);

      if (!recieverId) {
        console.warn(
          "Cannot determine recieverId from conversation participants:",
          participants,
        );
        safeSetState(() =>
          setError("Cannot determine message recipient. Please refresh."),
        );
        return;
      }

      safeSetState(() => setSending(true));

      try {
        await sendMessageApi({
          conversationId: conversation.id,
          recieverId,
          content: text.trim(),
        });
      } catch (err) {
        const msg =
          err?.response?.data?.ErrorMessage ||
          err?.message ||
          "Failed to send message.";

        safeSetState(() => setError(msg));
      } finally {
        safeSetState(() => setSending(false));
      }
    },
    [conversation, currentUser, safeSetState],
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const upsertMessage = (msg) => {
      if (!msg || msg.conversationId !== initializedConversationIdRef.current) {
        return;
      }

      safeSetState(() =>
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);

          if (exists) {
            return sortMessagesChronologically(
              prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
            );
          }

          return sortMessagesChronologically(dedupeMessages([...prev, msg]));
        }),
      );
    };

    const unsubReceive = onReceiveMessage(upsertMessage);
    const unsubUpdated = onConversationUpdated(upsertMessage);

    const unsubDelivered = onMessageDelivered((msg) => {
      if (!msg || msg.conversationId !== initializedConversationIdRef.current) {
        return;
      }

      safeSetState(() =>
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
        ),
      );
    });

    const unsubRead = onMessageRead((msg) => {
      if (!msg || msg.conversationId !== initializedConversationIdRef.current) {
        return;
      }

      safeSetState(() =>
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
        ),
      );
    });

    return () => {
      unsubReceive();
      unsubUpdated();
      unsubDelivered();
      unsubRead();
    };
  }, [safeSetState]);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        safeSetState(() => {
          setLoadingInit(true);
          setError(null);
          setConversation(null);
          setMessages([]);
          setHasMore(false);
          setNextCursor(null);
        });

        const [, conv] = await Promise.all([
          fetchCurrentUser(),
          fetchConversation(),
        ]);

        let resolvedConv = conv;

        if (!resolvedConv?.id && ticket?.assignedToId) {
          try {
            resolvedConv = await createConversationFromTicketApi(ticket);
            safeSetState(() => setConversation(resolvedConv));
          } catch (createErr) {
            const msg =
              createErr?.response?.data?.ErrorMessage ||
              createErr?.message ||
              "Failed to start conversation.";
            safeSetState(() => {
              setError(msg);
              setLoadingInit(false);
            });
            return;
          }
        }

        if (!resolvedConv?.id) {
          safeSetState(() => setLoadingInit(false));
          return;
        }

        initializedConversationIdRef.current = resolvedConv.id;

        const {
          msgs,
          nextCursor: nc,
          hasMore: hm,
        } = await fetchMessages(resolvedConv.id);

        safeSetState(() => {
          setMessages(msgs);
          setNextCursor(nc);
          setHasMore(hm);
          setLoadingInit(false);
        });

        await startConnection();
        await joinConversation(resolvedConv.id);
      } catch (err) {
        console.error("Chat init error:", err);
        safeSetState(() => setLoadingInit(false));
      } finally {
        isInitializingRef.current = false;
      }
    };

    init();

    return () => {
      mountedRef.current = false;

      if (initializedConversationIdRef.current) {
        leaveConversation(initializedConversationIdRef.current);
        initializedConversationIdRef.current = null;
      }
    };
  }, [
    ticket?.id,
    fetchConversation,
    fetchCurrentUser,
    fetchMessages,
    safeSetState,
  ]);

  return {
    currentUser,
    conversation,
    messages,
    hasMore,
    nextCursor,
    loadingInit,
    loadingMore,
    sending,
    error,
    doSend,
    loadMore,
    markAllRead,
  };
}
