import axiosInstance from "../utils/axiosInstance";

const BASE_URL = window.location.origin;

export const MESSAGING_HUB_URL = `${BASE_URL}/core/hubs/chatHub`;
// ─── Current User ─────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const res = await axiosInstance.get("/Authentication/GetCurrentUser");
  return res.data;
}

// ─── Conversations ────────────────────────────────────────────────────────────

/**
 * Check if a conversation already exists for a given ticket.
 * GET /api/Messaging/TicketConversation/{ticketId}
 */
export async function getTicketConversation(ticketId) {
  const res = await axiosInstance.get(
    `/Messaging/TicketConversation/${ticketId}`,
  );
  return res.data;
}

/**
 * Initialize a new conversation for a ticket.
 * POST /api/Messaging/Conversation
 */
export async function initConversation({ title, ticketId, participants }) {
  const res = await axiosInstance.post("/Messaging/Conversation", {
    type: "Direct",
    title,
    ticketId,
    participants,
  });
  return res.data;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

/**
 * Fetch messages for a conversation (cursor pagination).
 * GET /api/Messaging/Conversation/{conversationId}
 */
export async function getMessages(conversationId, { cursor, take = 20 } = {}) {
  const params = { take };
  if (cursor != null) params.cursor = cursor;
  const res = await axiosInstance.get(
    `/Messaging/Conversation/${conversationId}`,
    { params },
  );
  return res.data;
}

/**
 * Send a message.
 * POST /api/Messaging/Message
 */
export async function sendMessage({ conversationId, recieverId, content }) {
  const res = await axiosInstance.post("/Messaging/Message", {
    conversationId,
    recieverId,
    content,
    messageType: "Text",
  });
  return res.data;
}

/**
 * Mark message as delivered.
 * GET /api/Messaging/Message/{messageId}/Delivered
 */
export async function markDelivered(messageId) {
  const res = await axiosInstance.put(
    `/Messaging/Message/${messageId}/Delivered`,
  );
  return res.data;
}

/**
 * Mark message as read.
 * GET /api/Messaging/Message/{messageId}/Read
 */
export async function markRead(messageId) {
  const res = await axiosInstance.put(`/Messaging/Message/${messageId}/Read`);
  return res.data;
}
