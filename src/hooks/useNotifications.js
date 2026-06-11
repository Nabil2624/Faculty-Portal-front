import { useState, useEffect } from "react";
import { getUserNotifications } from "../services/notification.service";
import {
  startConnection,
  stopConnection,
} from "../services/startConnection.service";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const dedupe = (arr) => {
    const map = new Map();
    arr.forEach((n) => map.set(n.id, n));
    return Array.from(map.values());
  };

  // ===== initial load =====
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const data = await getUserNotifications(take);
      console.log(data);
      setNotifications(dedupe(data.items || []));
      setHasMore(data.hasMore);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===== load more (double take) =====
  const loadMoreNotifications = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);

      const newTake = take * 2;
      const data = await getUserNotifications(newTake);

      setNotifications((prev) => dedupe([...(data.items || [])]));

      setTake(newTake);
      setHasMore(data.hasMore);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===== SignalR =====
  const initSignalR = () => {
    startConnection((notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;

        return [notification, ...prev];
      });
    });
  };

  useEffect(() => {
    fetchNotifications();
    initSignalR();

    return () => stopConnection();
  }, []);

  return {
    notifications,
    loading,
    loadMoreNotifications,
    hasMore,
  };
};
