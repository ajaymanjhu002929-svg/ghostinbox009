import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

const SOCKET_URL =
  "https://ghostinbox09.onrender.com";

const SocketContext =
  createContext(null);

export const SocketProvider = ({
  children,
}) => {
  const socketRef =
    useRef(null);

  const [socket, setSocket] =
    useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    const notifyIncomingMessage = (incomingMessage) => {
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      if (!incomingMessage?._id) return;

      const connectionId = incomingMessage.connection?._id || incomingMessage.connection;
      const activeChat = localStorage.getItem("ghostinbox-active-chat");
      const sameChatVisible =
        document.visibilityState === "visible" &&
        window.location.pathname === "/chat" &&
        connectionId &&
        String(activeChat) === String(connectionId);

      if (sameChatVisible) return;

      // Prevent the same message from producing repeated notifications across
      // multiple GhostInbox tabs.
      const dedupeKey = `ghostinbox-notified:${incomingMessage._id}`;
      if (localStorage.getItem(dedupeKey)) return;
      localStorage.setItem(dedupeKey, String(Date.now()));
      setTimeout(() => localStorage.removeItem(dedupeKey), 15000);

      const notification = new Notification("New message", {
        body: incomingMessage.text || "You received a new message",
        tag: `ghostinbox-message-${incomingMessage._id}`,
      });

      notification.onclick = () => {
        window.focus();
        if (connectionId) {
          const receiverId = incomingMessage.sender?._id || incomingMessage.sender || "";
          const target = `/chat?connectionId=${encodeURIComponent(connectionId)}&receiverId=${encodeURIComponent(receiverId)}`;
          window.location.href = target;
        }
        notification.close();
      };
    };

    const requestPermissionAfterInteraction = async () => {
      if (!("Notification" in window)) return;
      if (Notification.permission !== "default") return;
      try { await Notification.requestPermission(); } catch { /* ignore */ }
      window.removeEventListener("pointerdown", requestPermissionAfterInteraction);
      window.removeEventListener("keydown", requestPermissionAfterInteraction);
    };

    socketInstance.on("connect", () => {
      console.log("Global socket connected:", socketInstance.id);
    });

    socketInstance.on("new-message", notifyIncomingMessage);
    socketInstance.on("connect_error", (error) => {
      console.error("Global socket error:", error?.message || error);
    });

    window.addEventListener("pointerdown", requestPermissionAfterInteraction, { once: true });
    window.addEventListener("keydown", requestPermissionAfterInteraction, { once: true });

    return () => {
      socketInstance.off("new-message", notifyIncomingMessage);
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
      window.removeEventListener("pointerdown", requestPermissionAfterInteraction);
      window.removeEventListener("keydown", requestPermissionAfterInteraction);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(
    SocketContext
  );
};
