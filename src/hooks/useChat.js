import { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import * as signalR from "@microsoft/signalr";
import { MESSAGING_HUB_URL } from "../services/messaging.service";

let connection = null;
let activeConversationId = null;

const callbacks = {
  receiveMessage: [],
  conversationUpdated: [],
  messageDelivered: [],
  messageRead: [],
  connectionStateChange: [],
};

function sortMessagesChronologically(items) {
  return [...items].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
}

function dedupeMessages(items) {
  const seen = new Set();

  return items.filter((m) => {
    const key = m?.id ?? `${m?.senderId}-${m?.createdAt}-${m?.content}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function notifyConnectionState() {
  const state = getConnectionState();
  callbacks.connectionStateChange.forEach((cb) => cb(state));
}

export function getConnectionState() {
  if (!connection) return "disconnected";

  switch (connection.state) {
    case signalR.HubConnectionState.Connected:
      return "connected";
    case signalR.HubConnectionState.Connecting:
    case signalR.HubConnectionState.Reconnecting:
      return "reconnecting";
    default:
      return "disconnected";
  }
}

export async function startConnection() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  if (connection) {
    try {
      await connection.stop();
    } catch (err) {
      console.warn("Error while stopping previous SignalR connection:", err);
    }
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(MESSAGING_HUB_URL, {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveMessage", (message) => {
    callbacks.receiveMessage.forEach((cb) => cb(message));
  });

  connection.on("ConversationUpdated", (message) => {
    callbacks.conversationUpdated.forEach((cb) => cb(message));
  });

  connection.on("MessageDelivered", (message) => {
    callbacks.messageDelivered.forEach((cb) => cb(message));
  });

  connection.on("MessageRead", (message) => {
    callbacks.messageRead.forEach((cb) => cb(message));
  });

  connection.onreconnecting((err) => {
    console.warn("SignalR reconnecting...", err);
    notifyConnectionState();
  });

  connection.onreconnected(async () => {
    notifyConnectionState();

    if (activeConversationId != null) {
      try {
        await connection.invoke("JoinConversation", activeConversationId);
      } catch (err) {
        console.warn("Could not rejoin conversation:", err);
      }
    }
  });

  connection.onclose((err) => {
    console.warn("SignalR connection closed:", err);
    notifyConnectionState();
  });

  await connection.start();
  notifyConnectionState();

  if (activeConversationId != null) {
    try {
      await connection.invoke("JoinConversation", activeConversationId);
    } catch (err) {
      console.warn("Could not join conversation after start:", err);
    }
  }
}

export async function stopConnection() {
  if (!connection) return;

  try {
    await connection.stop();
  } catch (err) {
    console.warn("Error while stopping SignalR connection:", err);
  } finally {
    connection = null;
    activeConversationId = null;
  }
}

export async function joinConversation(conversationId) {
  activeConversationId = conversationId;

  if (
    !connection ||
    connection.state !== signalR.HubConnectionState.Connected
  ) {
    return;
  }

  try {
    await connection.invoke("JoinConversation", conversationId);
  } catch (err) {
    console.warn("Could not join conversation:", err);
  }
}

export async function leaveConversation(conversationId) {
  if (
    !connection ||
    connection.state !== signalR.HubConnectionState.Connected
  ) {
    if (activeConversationId === conversationId) {
      activeConversationId = null;
    }
    return;
  }

  try {
    await connection.invoke("LeaveConversation", conversationId);
  } catch (err) {
    console.warn("Could not leave conversation:", err);
  } finally {
    if (activeConversationId === conversationId) {
      activeConversationId = null;
    }
  }
}

export function onReceiveMessage(cb) {
  callbacks.receiveMessage.push(cb);
  return () => {
    callbacks.receiveMessage = callbacks.receiveMessage.filter((c) => c !== cb);
  };
}

export function onConversationUpdated(cb) {
  callbacks.conversationUpdated.push(cb);
  return () => {
    callbacks.conversationUpdated = callbacks.conversationUpdated.filter(
      (c) => c !== cb,
    );
  };
}

export function onMessageDelivered(cb) {
  callbacks.messageDelivered.push(cb);
  return () => {
    callbacks.messageDelivered = callbacks.messageDelivered.filter(
      (c) => c !== cb,
    );
  };
}

export function onMessageRead(cb) {
  callbacks.messageRead.push(cb);
  return () => {
    callbacks.messageRead = callbacks.messageRead.filter((c) => c !== cb);
  };
}

export function onConnectionStateChange(cb) {
  callbacks.connectionStateChange.push(cb);
  cb(getConnectionState());

  return () => {
    callbacks.connectionStateChange = callbacks.connectionStateChange.filter(
      (c) => c !== cb,
    );
  };
}

// ---------------- Hook ----------------

const DEFAULT_TAKE = 20;
const CURRENT_USER_ENDPOINT = "/Authentication/GetCurrentUser";

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
      const res = await axiosInstance.get(CURRENT_USER_ENDPOINT);
      const data = res?.data ?? null;

      safeSetState(() => {
        setCurrentUser(data);
      });
    } catch (err) {
      console.warn("Could not fetch current user from:", CURRENT_USER_ENDPOINT);
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

      const res = await axiosInstance.get(
        `/Messaging/TicketConversation/${ticket.id}`,
      );
      const data = res?.data ?? null;

      safeSetState(() => {
        setConversation(data);
      });

      return data;
    } catch (err) {
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
      const params = { take: DEFAULT_TAKE };
      if (cursor != null) params.cursor = cursor;

      const res = await axiosInstance.get(
        `/Messaging/Conversation/${conversationId}`,
        { params },
      );
      const data = res?.data;

      const raw = Array.isArray(data)
        ? data
        : (data?.messages ?? data?.data ?? data?.items ?? []);

      const nc = data?.nextCursor ?? data?.cursor ?? null;
      const hm = data?.hasMore ?? raw.length === DEFAULT_TAKE;

      const msgs = sortMessagesChronologically(raw);

      return { msgs, nextCursor: nc, hasMore: hm };
    } catch (err) {
      console.warn("Failed to fetch messages:", err);
      return { msgs: [], nextCursor: null, hasMore: false };
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!messages.length || !currentUser) return;

    const myId = currentUser?.userId ?? currentUser?.id;

    const unread = messages.filter((m) => {
      const senderId = m.senderId ?? m.userId;
      const alreadyRead =
        m.isRead === true || m.read === true || m.status === "Read";

      return (
        String(senderId) !== String(myId) &&
        !alreadyRead &&
        m.id != null &&
        !readInFlightRef.current.has(m.id)
      );
    });

    if (!unread.length) return;

    unread.forEach((msg) => readInFlightRef.current.add(msg.id));

    try {
      await Promise.allSettled(
        unread.map((msg) =>
          axiosInstance.put(`/Messaging/Message/${msg.id}/Read`),
        ),
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

      const myId = currentUser?.userId ?? currentUser?.id;
      const participants = conversation.participants ?? [];

      const other = participants.find((p) => {
        const pid = p.userId ?? p.id ?? p.participantId;
        return String(pid) !== String(myId);
      });

      const recieverId = other?.userId ?? other?.id ?? other?.participantId;

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
        await axiosInstance.post("/Messaging/Message", {
          conversationId: conversation.id,
          recieverId,
          content: text.trim(),
          messageType: "Text",
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

        return sortMessagesChronologically(
          dedupeMessages([...prev, msg]),
        );
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

        if (!conv?.id) {
          safeSetState(() => setLoadingInit(false));
          return;
        }

        initializedConversationIdRef.current = conv.id;

        const {
          msgs,
          nextCursor: nc,
          hasMore: hm,
        } = await fetchMessages(conv.id);

        safeSetState(() => {
          setMessages(msgs);
          setNextCursor(nc);
          setHasMore(hm);
          setLoadingInit(false);
        });

        await startConnection();
        await joinConversation(conv.id);
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
  }, [ticket?.id, fetchConversation, fetchCurrentUser, fetchMessages, safeSetState]);

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