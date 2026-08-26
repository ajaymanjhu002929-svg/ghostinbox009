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
    const socketInstance =
      io(
        SOCKET_URL,
        {
          withCredentials: true,

          transports: [
            "websocket",
            "polling",
          ],
        }
      );

    socketRef.current =
      socketInstance;

    setSocket(socketInstance);

    socketInstance.on(
      "connect",
      () => {
        console.log(
          "Global socket connected:",
          socketInstance.id
        );
      }
    );

    socketInstance.on(
      "connect_error",
      (error) => {
        console.error(
          "Global socket error:",
          error?.message || error
        );
      }
    );

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
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
