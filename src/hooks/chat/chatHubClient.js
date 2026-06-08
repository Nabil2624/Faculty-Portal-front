import * as signalR from "@microsoft/signalr";
import { MESSAGING_HUB_URL } from "../../services/messaging.service";

let connection = null;
let activeConversationId = null;

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
