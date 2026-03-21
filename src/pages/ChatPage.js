import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronUp,
} from "lucide-react";
import useChat from "../hooks/useChat";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return null; // same day — don't repeat date
  }
  return d.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, isMine, isArabic }) {
  const date = formatDate(message.createdAt);
  const time = formatTime(message.createdAt);

  return (
    <div
      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
      style={{ marginBottom: "clamp(0.4rem, 0.7vw, 0.8rem)" }}
    >
      {/* Sender name */}
      <span
        className="font-semibold"
        style={{
          fontSize: "clamp(0.55rem, 0.75vw, 0.8rem)",
          color: isMine ? "#19355a" : "#6b7280",
          marginBottom: "clamp(0.1rem, 0.2vw, 0.2rem)",
        }}
      >
        {message.senderUsername}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "clamp(160px, 55vw, 520px)",
          padding:
            "clamp(0.45rem, 0.8vw, 0.9rem) clamp(0.65rem, 1.1vw, 1.2rem)",
          borderRadius: isMine
            ? "1rem 1rem 0.25rem 1rem"
            : "1rem 1rem 1rem 0.25rem",
          backgroundColor: isMine ? "#19355a" : "#f3f4f6",
          color: isMine ? "#fff" : "#111827",
          fontSize: "clamp(0.65rem, 0.9vw, 1rem)",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {message.content}
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontSize: "clamp(0.5rem, 0.65vw, 0.72rem)",
          color: "#9ca3af",
          marginTop: "clamp(0.1rem, 0.2vw, 0.2rem)",
        }}
      >
        {time}
      </span>
    </div>
  );
}

// ─── Date Separator ───────────────────────────────────────────────────────────

function DateSeparator({ label }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{ margin: "clamp(0.6rem, 1vw, 1rem) 0" }}
    >
      <div className="flex-1 h-px bg-gray-200" />
      <span
        className="text-gray-400 font-medium whitespace-nowrap"
        style={{ fontSize: "clamp(0.55rem, 0.72vw, 0.78rem)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { t, i18n } = useTranslation("Chat");
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket } = location.state || {};

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const {
    currentUser,
    conversation,
    messages,
    hasMore,
    loadingInit,
    loadingMore,
    sending,
    error,
    doSend,
    loadMore,
    markAllRead,
  } = useChat(ticket);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const textareaRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (loadingInit) return;
    if (isFirstLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingInit]);

  // Mark read when messages are visible
  useEffect(() => {
    if (!messages.length) return;

    const timer = setTimeout(() => {
      markAllRead();
    }, 400);

    return () => clearTimeout(timer);
  }, [messages.length, markAllRead]);

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!input.trim() || sending) return;
      const text = input;
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      await doSend(text);
    },
    [input, sending, doSend],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Redirect if no ticket in state
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb]">
        <p className="text-gray-500">{t("noTicket")}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#19355a] underline"
          style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
        >
          {t("goBack")}
        </button>
      </div>
    );
  }

  // Build date-grouped messages
  let lastDate = null;
  const renderedMessages = messages.map((msg, idx) => {
    const d = new Date(msg.createdAt);
    const dateLabel = d.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const showDateSep = dateLabel !== lastDate;
    lastDate = dateLabel;
    const myId = currentUser?.userId ?? currentUser?.id;
    const msgSenderId = msg.senderId ?? msg.userId;
    const isMine = !!myId && String(msgSenderId) === String(myId);

    return (
      <React.Fragment key={msg.id ?? idx}>
        {showDateSep && <DateSeparator label={dateLabel} />}
        <MessageBubble message={msg} isMine={isMine} isArabic={isArabic} />
      </React.Fragment>
    );
  });

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="bg-[#19355a] flex items-center gap-3 shrink-0"
        style={{
          padding: "clamp(0.6rem, 1vw, 1.2rem) clamp(0.8rem, 1.5vw, 2rem)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition"
        >
          <BackIcon
            style={{
              width: "clamp(1rem, 1.4vw, 1.5rem)",
              height: "clamp(1rem, 1.4vw, 1.5rem)",
            }}
          />
        </button>
        <div
          className="rounded-full bg-[#b38e19] flex items-center justify-center shrink-0"
          style={{
            width: "clamp(2rem, 2.5vw, 3rem)",
            height: "clamp(2rem, 2.5vw, 3rem)",
          }}
        >
          <MessageSquare
            className="text-white"
            style={{
              width: "clamp(0.9rem, 1.2vw, 1.4rem)",
              height: "clamp(0.9rem, 1.2vw, 1.4rem)",
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-white truncate"
            style={{ fontSize: "clamp(0.8rem, 1.1vw, 1.2rem)" }}
          >
            {ticket.title}
          </p>
          <p
            className="text-white/60 truncate"
            style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.88rem)" }}
          >
            {t("ticketId")}: #{ticket.id}
          </p>
        </div>
      </div>

      {/* ── Message area ────────────────────────────────── */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto"
        style={{
          padding: "clamp(0.8rem, 1.5vw, 2rem)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
              style={{
                padding:
                  "clamp(0.3rem, 0.5vw, 0.5rem) clamp(0.8rem, 1.2vw, 1.2rem)",
                fontSize: "clamp(0.6rem, 0.82vw, 0.88rem)",
              }}
            >
              {loadingMore ? (
                <RefreshCw
                  className="animate-spin"
                  style={{
                    width: "clamp(0.7rem, 0.9vw, 1rem)",
                    height: "clamp(0.7rem, 0.9vw, 1rem)",
                  }}
                />
              ) : (
                <ChevronUp
                  style={{
                    width: "clamp(0.7rem, 0.9vw, 1rem)",
                    height: "clamp(0.7rem, 0.9vw, 1rem)",
                  }}
                />
              )}
              {t("loadMore")}
            </button>
          </div>
        )}

        {loadingInit ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-gray-400">
            <RefreshCw
              className="animate-spin"
              style={{
                width: "clamp(1rem, 1.5vw, 1.8rem)",
                height: "clamp(1rem, 1.5vw, 1.8rem)",
              }}
            />
            <span style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}>
              {t("loading")}
            </span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <MessageSquare
              className="text-gray-200"
              style={{
                width: "clamp(2rem, 3.5vw, 4rem)",
                height: "clamp(2rem, 3.5vw, 4rem)",
              }}
            />
            <p
              className="text-gray-400"
              style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
            >
              {t("noMessages")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">{renderedMessages}</div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 mt-2"
            style={{ padding: "clamp(0.5rem, 0.8vw, 0.8rem)" }}
          >
            <AlertCircle className="text-red-500 w-4 h-4 shrink-0 mt-0.5" />
            <p
              className="text-red-600"
              style={{ fontSize: "clamp(0.65rem, 0.88vw, 0.95rem)" }}
            >
              {error}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ───────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="bg-white border-t border-gray-200 shrink-0"
        style={{
          padding: "clamp(0.6rem, 1vw, 1.2rem) clamp(0.8rem, 1.5vw, 2rem)",
          display: "flex",
          gap: "clamp(0.5rem, 0.8vw, 1rem)",
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          rows={1}
          disabled={!conversation && !ticket}
          className="flex-1 rounded-xl border border-gray-200 resize-none outline-none text-gray-700 scrollbar-hide"
          style={{
            padding: "clamp(0.4rem, 0.7vw, 0.8rem) clamp(0.6rem, 1vw, 1rem)",
            fontSize: "clamp(0.7rem, 0.95vw, 1rem)",
            maxHeight: "clamp(5rem, 8vw, 9rem)",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`;
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-xl bg-[#19355a] text-white flex items-center justify-center shrink-0 hover:bg-[#19355a]/90 transition disabled:opacity-50"
          style={{
            width: "clamp(2rem, 3vw, 3.5rem)",
            height: "clamp(2rem, 3vw, 3.5rem)",
          }}
        >
          {sending ? (
            <RefreshCw
              className="animate-spin"
              style={{
                width: "clamp(0.9rem, 1.2vw, 1.3rem)",
                height: "clamp(0.9rem, 1.2vw, 1.3rem)",
              }}
            />
          ) : (
            <Send
              style={{
                width: "clamp(0.9rem, 1.2vw, 1.3rem)",
                height: "clamp(0.9rem, 1.2vw, 1.3rem)",
                transform: isArabic ? "scaleX(-1)" : "none",
              }}
            />
          )}
        </button>
      </form>
    </div>
  );
}
