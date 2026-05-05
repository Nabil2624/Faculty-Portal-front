import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const useResearchProgress = (nationalNumber) => {
  const [progressData, setProgressData] = useState({
    progress: 0,
    total: 0,
    completed: 0,
    eta: 0,
    message: "جاري الاتصال بخادم الأبحاث...",
    status: "connecting",
  });

  useEffect(() => {
    if (!nationalNumber) return;

    // إعداد الاتصال
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://172.1.50.98/hubs/researchProgressHub")
      .withAutomaticReconnect()
      .build();

    // بدء الاتصال
    connection
      .start()
      .then(() => {
        console.log("✅ SignalR Connected");
        connection.invoke("JoinGroup", nationalNumber);
        setProgressData((prev) => ({ ...prev, status: "loading" }));
      })
      .catch((err) => {
        console.error("❌ SignalR Connection Error:", err);
        setProgressData((prev) => ({
          ...prev,
          status: "error",
          message: "فشل الاتصال بالخادم",
        }));
      });

    // الاستماع للبيانات
    connection.on("ReceiveProgress", (data) => {
      setProgressData({
        progress: data.percentage || 0,
        total: data.total || 0,
        completed: data.current || 0,
        eta: data.estimated_Finish ? 10 : 0,
        message: data.status || "جاري المعالجة...",
        status: data.percentage >= 100 ? "completed" : "loading",
      });
    });
  
    // التعامل مع إعادة الاتصال
    connection.onreconnecting(() => {
      setProgressData((prev) => ({
        ...prev,
        message: "جاري إعادة الاتصال...",
      }));
    });

    connection.onreconnected(() => {
      connection.invoke("JoinGroup", nationalNumber);
    });

    // التنظيف عند خروج المكون
    return () => {
      if (connection) {
        connection
          .invoke("LeaveGroup", nationalNumber)
          .catch((e) => console.warn("LeaveGroup failed", e));
        connection.stop();
      }
    };
  }, [nationalNumber]);

  return progressData;
};

export default useResearchProgress;
