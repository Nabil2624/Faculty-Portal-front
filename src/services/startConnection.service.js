import * as signalR from "@microsoft/signalr";

let connection = null;
let isStarted = false;

export const startConnection = async (onNotificationReceived) => {
  try {
    if (!connection) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7184/hubs/notificationHub", {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveNotification", (notification) => {
        onNotificationReceived?.(notification);
      });

      connection.onclose(() => {
        console.warn("SignalR disconnected");
        isStarted = false;
      });

      connection.onreconnecting(() => {
        console.warn("SignalR reconnecting...");
      });

      connection.onreconnected(() => {
        console.log("SignalR reconnected");
      });
    }

    if (isStarted) return;

    await connection.start();
    isStarted = true;

    console.log("SignalR Connected");
  } catch (error) {
    console.warn("SignalR connection failed:", error);
    isStarted = false;
  }
};

export const stopConnection = async () => {
  try {
    if (connection) {
      await connection.stop();
      connection = null;
      isStarted = false;
    }
  } catch (error) {
    console.warn("SignalR stop failed:", error);
  }
};