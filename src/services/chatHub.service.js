/**
 * Singleton SignalR chat hub client.
 * Manages a single persistent connection shared across the app.
 */

import * as signalR from "@microsoft/signalr";
import { MESSAGING_HUB_URL } from "./messaging.service";

let connection = null;
let activeConversationId = null;
let accessToken = null;

/** Call this before startConnection() so the hub handshake includes the JWT. */
export function setAccessToken(token) {
  accessToken = token;
}

const callbacks = {
  receiveMessage: [],
  conversationUpdated: [],
  messageDelivered: [],
  messageRead: [],
  connectionStateChange: [],
};

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
  if (connection && connection.state === signalR.HubConnectionState.Connected)
    return;

  if (connection) {
    await connection.stop();
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(MESSAGING_HUB_URL, {
      withCredentials: true,
      accessTokenFactory: () => accessToken || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
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

  connection.onreconnecting(() => notifyConnectionState());

  connection.onreconnected(async () => {
    notifyConnectionState();
    if (activeConversationId != null) {
      try {
        await connection.invoke("JoinConversation", activeConversationId);
      } catch {}
    }
  });

  connection.onclose(() => notifyConnectionState());

  await connection.start();
  notifyConnectionState();
}

export async function stopConnection() {
  if (!connection) return;
  await connection.stop();
  connection = null;
  activeConversationId = null;
}

export async function joinConversation(conversationId) {
  activeConversationId = conversationId;
  if (!connection || connection.state !== signalR.HubConnectionState.Connected)
    return;
  try {
    await connection.invoke("JoinConversation", conversationId);
  } catch (err) {
    console.warn("Could not join conversation group:", err);
  }
}

export async function leaveConversation(conversationId) {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected)
    return;
  try {
    await connection.invoke("LeaveConversation", conversationId);
    if (activeConversationId === conversationId) activeConversationId = null;
  } catch {}
}

// ── Subscription helpers ───────────────────────────────────────────────────

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
