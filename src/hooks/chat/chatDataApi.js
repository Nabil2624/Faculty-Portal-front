import axiosInstance from "../../utils/axiosInstance";
import { sortMessagesChronologically } from "./messageUtils";

export const DEFAULT_TAKE = 20;
export const CURRENT_USER_ENDPOINT = "/Authentication/GetCurrentUser";

export async function fetchCurrentUserApi() {
  const res = await axiosInstance.get(CURRENT_USER_ENDPOINT);
  return res?.data ?? null;
}

export async function fetchConversationByTicketIdApi(ticketId) {
  const res = await axiosInstance.get(
    `/Messaging/TicketConversation/${ticketId}`,
  );
  return res?.data ?? null;
}

export async function createConversationFromTicketApi(ticket) {
  const now = new Date().toISOString();
  const participants = [
    {
      userId: ticket.senderId,
      username: ticket.senderUsername ?? "",
      joinedAt: now,
    },
    {
      userId: ticket.assignedToId,
      username: ticket.assigneeUsername ?? "",
      joinedAt: now,
    },
  ];

  const res = await axiosInstance.post("/Messaging/Conversation", {
    type: "Direct",
    title: ticket.title ?? "Ticket Conversation",
    ticketId: ticket.id,
    participants,
  });

  return res?.data ?? null;
}

export async function fetchMessagesApi(conversationId, cursor = null) {
  const params = { take: DEFAULT_TAKE };
  if (cursor != null) params.cursor = cursor;

  const res = await axiosInstance.get(
    `/Messaging/Conversation/${conversationId}`,
    {
      params,
    },
  );
  const data = res?.data;

  const raw = Array.isArray(data)
    ? data
    : (data?.messages ?? data?.data ?? data?.items ?? []);

  const nc = data?.nextCursor ?? data?.cursor ?? null;
  const hm = data?.hasMore ?? raw.length === DEFAULT_TAKE;

  return {
    msgs: sortMessagesChronologically(raw),
    nextCursor: nc,
    hasMore: hm,
  };
}

export async function sendMessageApi({ conversationId, recieverId, content }) {
  return axiosInstance.post("/Messaging/Message", {
    conversationId,
    recieverId,
    content,
    messageType: "Text",
  });
}

export async function markMessageAsReadApi(messageId) {
  return axiosInstance.put(`/Messaging/Message/${messageId}/Read`);
}
