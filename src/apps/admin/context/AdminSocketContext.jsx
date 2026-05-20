import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { URL as BASE_URL } from "@shared/config/api";
import { toast } from "react-toastify";
import { useNotifications } from "../hooks/useNotifications";
import { playNotificationSound, showCoordinatedToast, subscribeToNotifications } from "@shared/utils/notification-utils";

const AdminSocketContext = createContext(null);

const ENABLE_SOCKET = import.meta.env.VITE_ENABLE_SOCKET === "true";

export const AdminSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const socketRef = useRef(null);
  const { setNotifications } = useNotifications();

  // Keep references of registered sub-listeners from individual pages
  const listenersRef = useRef({
    "order:new": new Set(),
    "order:update": new Set(),
    "order:delete": new Set(),
  });

  const registerListener = (event, callback) => {
    if (listenersRef.current[event]) {
      listenersRef.current[event].add(callback);
    }
    return () => {
      if (listenersRef.current[event]) {
        listenersRef.current[event].delete(callback);
      }
    };
  };

  const playAlert = async () => {
    try {
      await playNotificationSound();
      setIsAudioBlocked(false);
    } catch (err) {
      console.error("[Global Socket Audio Error]:", err);
      setIsAudioBlocked(true);
    }
  };

  useEffect(() => {
    if (!ENABLE_SOCKET) return;

    if (!socketRef.current) {
      console.log("[Global Socket]: Connecting to", BASE_URL);
      socketRef.current = io(BASE_URL, {
        transports: ["websocket", "polling"],
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("[Global Socket Connected]:", socket.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("[Global Socket Disconnected]");
        setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("[Global Socket Connection Error]:", err.message);
        setIsConnected(false);
      });

      // Handle order:new globally (sound + toast + notifications state)
      socket.on("order:new", (newOrder) => {
        console.log("[Global Socket]: New order received", newOrder);
        
        if (newOrder?._id) {
          setNotifications((n) => {
            if (n.some(item => item.id === newOrder._id)) return n;
            return [...n, { id: newOrder._id, message: "New Order!", items: newOrder }];
          });
        }
        
        playAlert();
        showCoordinatedToast("New order received!", toast.success);

        // Disseminate to active sub-listeners
        listenersRef.current["order:new"].forEach((cb) => cb(newOrder));
      });

      socket.on("order:update", (updatedOrder) => {
        listenersRef.current["order:update"].forEach((cb) => cb(updatedOrder));
      });

      socket.on("order:delete", (deletedOrderId) => {
        listenersRef.current["order:delete"].forEach((cb) => cb(deletedOrderId));
      });

      // Broadcast subscription
      const unsubscribeBroadcast = subscribeToNotifications((payload) => {
        console.log("[Global Socket]: FCM foreground sync", payload);
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
        unsubscribeBroadcast();
      };
    }
  }, [setNotifications]);

  const value = {
    socket: socketRef.current,
    isConnected,
    isAudioBlocked,
    setIsAudioBlocked,
    playAlert,
    registerListener,
    emit: (event, data) => socketRef.current?.emit(event, data),
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export const useAdminSocket = () => {
  const context = useContext(AdminSocketContext);
  if (!context) {
    throw new Error("useAdminSocket must be used within an AdminSocketProvider");
  }
  return context;
};
