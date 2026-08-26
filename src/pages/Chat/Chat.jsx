import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { io } from "socket.io-client";

const API_URL =
  "https://ghostinbox09.onrender.com/api";

const SOCKET_URL =
  "https://ghostinbox09.onrender.com";

// =========================================================
// CHAT COMPONENT
// =========================================================

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =======================================================
  // CURRENT USER
  // =======================================================

  const [currentUser, setCurrentUser] =
    useState(null);

  const [currentUserId, setCurrentUserId] =
    useState(null);

  const [loadingCurrentUser, setLoadingCurrentUser] =
    useState(true);

  // =======================================================
  // SELECTED CHAT
  // =======================================================

  const [selectedUser, setSelectedUser] =
    useState(
      location.state?.user || null
    );

  const [selectedConnection, setSelectedConnection] =
    useState(
      location.state?.connection || null
    );

  const [selectedConnectionId, setSelectedConnectionId] =
    useState(
      location.state?.connectionId ||
        location.state?.connection?._id ||
        location.state?.connection?.id ||
        null
    );

  const [selectedReceiverId, setSelectedReceiverId] =
    useState(
      location.state?.receiverId ||
        location.state?.user?._id ||
        location.state?.user?.id ||
        null
    );

  // =======================================================
  // ONLINE / OFFLINE
  // =======================================================

  const [isOtherUserOnline, setIsOtherUserOnline] =
  useState(
    Boolean(
      location.state?.user?.isOnline
    )
  );

  const [otherUserLastSeen, setOtherUserLastSeen] =
    useState(
      location.state?.user?.lastSeen ||
        null
    );

  // =======================================================
  // TYPING
  // =======================================================

  const [isOtherUserTyping, setIsOtherUserTyping] =
    useState(false);

  const typingTimeoutRef =
    useRef(null);

  // =======================================================
  // CONNECTIONS
  // =======================================================

  const [connections, setConnections] =
    useState([]);

  const [loadingConnections, setLoadingConnections] =
    useState(true);

  // =======================================================
  // MESSAGES
  // =======================================================

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] =
    useState("");

  // =======================================================
  // SAFETY PROMPT
  // =======================================================

  const [showSafetyPrompt, setShowSafetyPrompt] =
    useState(false);

  const [safetyMessage, setSafetyMessage] =
    useState("");

  const [safetyMessageIds, setSafetyMessageIds] =
    useState([]);

  const [safetyAutoSave, setSafetyAutoSave] =
    useState(false);

  // =======================================================
  // REMOVE CONNECTION
  // =======================================================

  const [showMenu, setShowMenu] =
    useState(false);

  const [showRemoveModal, setShowRemoveModal] =
    useState(false);

  const [removingConnection, setRemovingConnection] =
    useState(false);

  // =======================================================
  // REFS
  // =======================================================

  const socketRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const selectedReceiverIdRef =
    useRef(selectedReceiverId);

  const selectedConnectionIdRef =
    useRef(selectedConnectionId);

  useEffect(() => {
    selectedReceiverIdRef.current =
      selectedReceiverId;
  }, [selectedReceiverId]);

  useEffect(() => {
    selectedConnectionIdRef.current =
      selectedConnectionId;
  }, [selectedConnectionId]);

  // =======================================================
  // GET ID
  // =======================================================

  const getId = (value) => {
    if (!value) {
      return null;
    }

    if (typeof value === "object") {
      return (
        value?._id?.toString() ||
        value?.id?.toString() ||
        null
      );
    }

    return value.toString();
  };

  // =======================================================
  // USER OBJECT
  // =======================================================

  const getUserObject = (user) => {
    if (
      !user ||
      typeof user !== "object"
    ) {
      return null;
    }

    return user;
  };

  // =======================================================
  // FORMAT LAST SEEN
  // =======================================================

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) {
      return "Offline";
    }

    const date =
      new Date(lastSeen);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Offline";
    }

    return `Last seen ${date.toLocaleString(
      [],
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  // =======================================================
  // NORMALIZE MESSAGE
  // =======================================================

  const normalizeMessage = (
    messageData
  ) => {
    if (!messageData) {
      return null;
    }

    return {
      ...messageData,

      _id:
        messageData._id ||
        messageData.id ||
        null,

      text:
        messageData.text ||
        "",

      sender:
        getId(
          messageData.sender
        ),

      receiver:
        getId(
          messageData.receiver
        ),

      connection:
        getId(
          messageData.connection
        ),

      createdAt:
        messageData.createdAt ||
        new Date().toISOString(),

      isRead:
        Boolean(
          messageData.isRead
        ),

      isFlagged:
        Boolean(
          messageData.isFlagged
        ),

      isSavedAsEvidence:
        Boolean(
          messageData.isSavedAsEvidence
        ),
    };
  };

  // =======================================================
  // SCROLL
  // =======================================================

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  // =======================================================
  // LOAD CURRENT USER
  // =======================================================

  useEffect(() => {
    const loadCurrentUser =
      async () => {
        try {
          setLoadingCurrentUser(
            true
          );

          const response =
            await fetch(
              `${API_URL}/auth/me`,
              {
                method: "GET",
                credentials: "include",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Failed to load current user"
            );
          }

          const user =
            data?.user ||
            data?.data ||
            data;

          const userId =
            getId(user);

          if (!userId) {
            throw new Error(
              "Current user ID not found"
            );
          }

          setCurrentUser(user);

          setCurrentUserId(
            userId
          );
        } catch (error) {
          console.error(
            "Current user error:",
            error
          );

          setError(
            error.message ||
              "Unable to identify current user"
          );
        } finally {
          setLoadingCurrentUser(
            false
          );
        }
      };

    loadCurrentUser();
  }, []);

  // =======================================================
  // GET OTHER USER
  // =======================================================

  const getOtherUser = (
    connection
  ) => {
    if (
      !connection ||
      !currentUserId
    ) {
      return null;
    }

    const user1 =
      getUserObject(
        connection.user1
      );

    const user2 =
      getUserObject(
        connection.user2
      );

    const user1Id =
      getId(user1);

    const user2Id =
      getId(user2);

    if (
      user1Id ===
      currentUserId
    ) {
      return user2;
    }

    if (
      user2Id ===
      currentUserId
    ) {
      return user1;
    }

    return (
      connection.otherUser ||
      connection.matchedUser ||
      connection.receiver ||
      null
    );
  };

  // =======================================================
  // LOAD CONNECTIONS
  // =======================================================

  const loadConnections =
    async () => {
      try {
        setLoadingConnections(
          true
        );

        setError("");

        const response =
          await fetch(
            `${API_URL}/connections`,
            {
              method: "GET",
              credentials: "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load connections"
          );
        }

        const loadedConnections =
          data?.connections ||
          data?.data ||
          [];

        setConnections(
          Array.isArray(
            loadedConnections
          )
            ? loadedConnections
            : []
        );
      } catch (error) {
        console.error(
          "Connections error:",
          error
        );

        setError(
          error.message ||
            "Unable to load chats"
        );
      } finally {
        setLoadingConnections(
          false
        );
      }
    };

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    loadConnections();
  }, [currentUserId]);

  // =======================================================
  // OPEN CHAT
  // =======================================================

  const handleOpenChat = (
    connection
  ) => {
    const connectionId =
      getId(connection);

    if (!connectionId) {
      alert(
        "Connection ID not found."
      );

      return;
    }

    const otherUser =
      getOtherUser(
        connection
      );

    const receiverId =
      getId(otherUser);

    if (!receiverId) {
      alert(
        "Other user not found."
      );

      return;
    }

    setSelectedConnection(
      connection
    );

    setSelectedConnectionId(
      connectionId
    );

    setSelectedUser(
      otherUser
    );

    setSelectedReceiverId(
      receiverId
    );

    setOtherUserLastSeen(
      otherUser?.lastSeen ||
        null
    );

    setIsOtherUserOnline(
      Boolean(
        otherUser?.isOnline
      )
    );

    setIsOtherUserTyping(
      false
    );

    setMessages([]);

    setMessage("");

    setError("");

    navigate(
      "/chat",
      {
        replace: true,
        state: {
          connection,
          connectionId,
          user: otherUser,
          receiverId,
        },
      }
    );
  };

  // =======================================================
  // LOAD CHAT HISTORY
  // =======================================================

  useEffect(() => {
    if (!selectedConnectionId) {
      return;
    }

    const loadMessages =
      async () => {
        try {
          setLoadingMessages(
            true
          );

          setError("");

          const response =
            await fetch(
              `${API_URL}/messages/${selectedConnectionId}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Failed to load messages"
            );
          }

          const loadedMessages =
            (
              data?.messages ||
              data?.data ||
              []
            )
              .map(
                normalizeMessage
              )
              .filter(Boolean);

          setMessages(
            loadedMessages
          );

          scrollToBottom();

          // ================================================
          // MARK RECEIVED MESSAGES AS READ
          // ================================================

          try {
            await fetch(
              `${API_URL}/messages/connection/${selectedConnectionId}/read-all`,
              {
                method: "PATCH",
                credentials: "include",
              }
            );
          } catch (
            readError
          ) {
            console.error(
              "Read messages error:",
              readError
            );
          }
        } catch (error) {
          console.error(
            "Messages error:",
            error
          );

          setError(
            error.message ||
              "Unable to load conversation"
          );
        } finally {
          setLoadingMessages(
            false
          );
        }
      };

    loadMessages();
  }, [selectedConnectionId]);

  // =======================================================
  // SOCKET CONNECTION
  // =======================================================

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const socket = io(
      SOCKET_URL,
      {
        withCredentials: true,
        transports: [
          "websocket",
          "polling",
        ],
      }
    );

    socketRef.current = socket;

    // =====================================================
    // PRESENCE
    // =====================================================

    const requestCurrentPresence = () => {
      const receiverId = getId(
        selectedReceiverIdRef.current
      );

      if (!receiverId) {
        return;
      }

      socket.emit(
        "get-user-presence",
        {
          userId: receiverId,
        }
      );
    };

    const handleUserPresence = (data) => {
      const presenceUserId = getId(
        data?.userId || data?.id
      );

      if (
        presenceUserId !==
        getId(selectedReceiverIdRef.current)
      ) {
        return;
      }

      const online = Boolean(
        data?.isOnline
      );

      setIsOtherUserOnline(online);

      setOtherUserLastSeen(
        online
          ? null
          : data?.lastSeen || null
      );
    };

    // =====================================================
    // TYPING
    // =====================================================

    const handleUserTyping = (data) => {
      const typingUserId = getId(
        data?.userId || data?.senderId
      );

      const eventConnectionId = getId(
        data?.connectionId
      );

      if (
        typingUserId !==
        getId(selectedReceiverIdRef.current)
      ) {
        return;
      }

      if (
        eventConnectionId &&
        eventConnectionId !==
        getId(selectedConnectionIdRef.current)
      ) {
        return;
      }

      setIsOtherUserTyping(
        Boolean(data?.isTyping)
      );
    };

    // =====================================================
    // NEW MESSAGE
    // =====================================================

    const handleNewMessage = (incomingMessage) => {
      const normalized =
        normalizeMessage(
          incomingMessage
        );

      if (!normalized) {
        return;
      }

      if (
        getId(normalized.connection) !==
        getId(selectedConnectionIdRef.current)
      ) {
        return;
      }

      setMessages((previous) => {
        const exists = previous.some(
          (item) =>
            getId(item._id) ===
            getId(normalized._id)
        );

        if (exists) {
          return previous;
        }

        return [
          ...previous,
          normalized,
        ];
      });

      setIsOtherUserTyping(false);
      scrollToBottom();

      if (
        getId(normalized.receiver) ===
        getId(currentUserId) &&
        normalized._id
      ) {
        socket.emit(
          "message-read",
          {
            messageId: normalized._id,
          }
        );
      }
    };

    // =====================================================
    // MESSAGE SENT
    // =====================================================

    const handleMessageSent = (sentMessage) => {
      const normalized =
        normalizeMessage(sentMessage);

      if (!normalized) {
        return;
      }

      if (
        normalized.connection &&
        getId(normalized.connection) !==
        getId(selectedConnectionIdRef.current)
      ) {
        return;
      }

      setMessages((previous) => {
        const exists = previous.some(
          (item) =>
            getId(item._id) ===
            getId(normalized._id)
        );

        if (exists) {
          return previous;
        }

        return [
          ...previous,
          normalized,
        ];
      });

      setSending(false);
      setMessage("");
      setIsOtherUserTyping(false);
      scrollToBottom();
    };

    // =====================================================
    // MESSAGE READ
    // =====================================================

    const handleMessageRead = (data) => {
      if (!data?.messageId) {
        return;
      }

      setMessages((previous) =>
        previous.map((item) => {
          if (
            getId(item._id) !==
            getId(data.messageId)
          ) {
            return item;
          }

          return {
            ...item,
            isRead: true,
            readAt:
              data.readAt ||
              new Date().toISOString(),
          };
        })
      );
    };

    // =====================================================
    // SAFETY PROMPT
    // =====================================================

    const handleSafetyPrompt = (data) => {
      const incomingMessageIds =
        Array.isArray(data?.messageIds)
          ? data.messageIds
          : data?.messageId
          ? [data.messageId]
          : [];

      setSafetyMessage(
        data?.message ||
          "This conversation may contain harmful content."
      );

      setSafetyMessageIds(
        incomingMessageIds
      );

      setSafetyAutoSave(
        Boolean(data?.autoSave)
      );

      setShowSafetyPrompt(true);
    };

    const handleConnectError = (socketError) => {
      console.error(
        "Socket error:",
        socketError.message
      );
    };

    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      requestCurrentPresence();
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "user-presence",
      handleUserPresence
    );

    socket.on(
      "user-typing",
      handleUserTyping
    );

    socket.on(
      "new-message",
      handleNewMessage
    );

    socket.on(
      "message-sent",
      handleMessageSent
    );

    socket.on(
      "message-read",
      handleMessageRead
    );

    socket.on(
      "safety-prompt",
      handleSafetyPrompt
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    // Socket is intentionally created only once per logged-in user.
    // Presence for the currently selected receiver is refreshed whenever
    // the receiver/connection changes by the second effect below.

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "user-presence",
        handleUserPresence
      );

      socket.off(
        "user-typing",
        handleUserTyping
      );

      socket.off(
        "new-message",
        handleNewMessage
      );

      socket.off(
        "message-sent",
        handleMessageSent
      );

      socket.off(
        "message-read",
        handleMessageRead
      );

      socket.off(
        "safety-prompt",
        handleSafetyPrompt
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.disconnect();

      socketRef.current = null;
    };
  }, [currentUserId]);

  // =======================================================
  // REFRESH SELECTED USER PRESENCE
  // =======================================================

  useEffect(() => {
    if (
      !socketRef.current?.connected ||
      !selectedReceiverId
    ) {
      return;
    }

    setIsOtherUserTyping(false);

    socketRef.current.emit(
      "get-user-presence",
      {
        userId: selectedReceiverId,
      }
    );
  }, [
    selectedReceiverId,
    selectedConnectionId,
  ]);

  // =======================================================
  // SEND TYPING STATUS
  // =======================================================

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (
      !socketRef.current?.connected ||
      !selectedReceiverId ||
      !selectedConnectionId
    ) {
      return;
    }

    socketRef.current.emit(
      "typing-stop",
      {
        receiver: selectedReceiverId,
        receiverId: selectedReceiverId,
        connectionId: selectedConnectionId,
      }
    );
  };

  const handleTyping = (value) => {
    if (
      !socketRef.current?.connected ||
      !selectedReceiverId ||
      !selectedConnectionId
    ) {
      return;
    }

    // Empty input means the user stopped typing immediately.
    if (!value?.trim()) {
      stopTyping();
      return;
    }

    socketRef.current.emit(
      "typing-start",
      {
        receiver: selectedReceiverId,
        receiverId: selectedReceiverId,
        connectionId: selectedConnectionId,
      }
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1200);
  };

  // Always stop typing when the selected chat changes or Chat unmounts.
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [selectedReceiverId, selectedConnectionId]);

  // =======================================================
  // SEND MESSAGE
  // =======================================================

  const handleSend = async () => {
    const text =
      message.trim();

    if (
      !text ||
      sending
    ) {
      return;
    }

    if (
      !selectedConnectionId ||
      !selectedReceiverId
    ) {
      alert(
        "Chat connection not found."
      );

      return;
    }

    setSending(true);

    // -----------------------------------------------
    // STOP TYPING
    // -----------------------------------------------

    stopTyping();

    // =====================================================
    // SOCKET SEND
    // =====================================================

    if (
      socketRef.current?.connected
    ) {
      socketRef.current.emit(
        "send-message",
        {
          connectionId:
            selectedConnectionId,

          receiver:
            selectedReceiverId,

          text,
        },

        (result) => {
          if (
            !result?.success
          ) {
            setSending(false);

            alert(
              result?.message ||
                "Failed to send message"
            );
          }
        }
      );

      return;
    }

    // =====================================================
    // HTTP FALLBACK
    // =====================================================

    try {
      const response =
        await fetch(
          `${API_URL}/messages`,
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                connectionId:
                  selectedConnectionId,

                receiverId:
                  selectedReceiverId,

                text,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to send message"
        );
      }

      const newMessage =
        normalizeMessage(
          data?.message ||
            data?.data
        );

      if (newMessage) {
        setMessages(
          (previous) => [
            ...previous,
            newMessage,
          ]
        );
      }

      setMessage("");

      scrollToBottom();
    } catch (error) {
      console.error(
        "Send error:",
        error
      );

      alert(
        error.message ||
          "Unable to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // =======================================================
  // ENTER TO SEND
  // =======================================================

  const handleKeyDown =
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleSend();
      }
    };

  // =======================================================
  // SAVE SAFETY CONVERSATION
  // =======================================================

  const handleSaveConversation =
    () => {
      if (
        !selectedConnectionId
      ) {
        alert(
          "Connection not found."
        );

        return;
      }

      if (
        !safetyMessageIds ||
        safetyMessageIds.length === 0
      ) {
        alert(
          "No messages available to save as evidence."
        );

        return;
      }

      setShowSafetyPrompt(
        false
      );

      navigate(
        "/safety-prompt",
        {
          state: {
            user:
              selectedUser,

            connection:
              selectedConnection,

            connectionId:
              selectedConnectionId,

            receiverId:
              selectedReceiverId,

            messageIds:
              safetyMessageIds,

            category:
              "harmful_content",

            autoSave:
              safetyAutoSave,

            from:
              "chat",
          },
        }
      );
    };

  // =======================================================
  // DISMISS SAFETY
  // =======================================================

  const handleDismissSafety =
    () => {
      setShowSafetyPrompt(
        false
      );

      setSafetyMessage("");

      setSafetyMessageIds([]);

      setSafetyAutoSave(false);
    };

  // =======================================================
  // REPORT CONVERSATION
  // =======================================================

  const handleReportConversation =
    () => {
      if (
        !selectedConnectionId
      ) {
        alert(
          "Connection not found."
        );

        return;
      }

      const allMessageIds =
        messages
          .map(
            (item) =>
              getId(item._id)
          )
          .filter(Boolean);

      if (
        allMessageIds.length === 0
      ) {
        alert(
          "There are no messages to report."
        );

        return;
      }

      setSafetyMessage(
        "Would you like to save this conversation as evidence for your report?"
      );

      setSafetyMessageIds(
        allMessageIds
      );

      setSafetyAutoSave(false);

      setShowSafetyPrompt(
        true
      );
    };

  // =======================================================
  // REMOVE CONNECTION
  // =======================================================

  const handleRemoveConnection =
    async () => {
      if (
        !selectedConnectionId ||
        removingConnection
      ) {
        return;
      }

      try {
        setRemovingConnection(
          true
        );

        const response =
          await fetch(
            `${API_URL}/connections/${selectedConnectionId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to remove connection"
          );
        }

        setConnections(
          (previous) =>
            previous.filter(
              (connection) =>
                getId(connection) !==
                getId(
                  selectedConnectionId
                )
            )
        );

        setShowRemoveModal(
          false
        );

        setShowMenu(false);

        setSelectedUser(null);

        setSelectedConnection(
          null
        );

        setSelectedConnectionId(
          null
        );

        setSelectedReceiverId(
          null
        );

        setMessages([]);

        setMessage("");

        setIsOtherUserOnline(
          false
        );

        setIsOtherUserTyping(
          false
        );

        setOtherUserLastSeen(
          null
        );

        alert(
          "Connection removed successfully."
        );

        await loadConnections();
      } catch (error) {
        console.error(
          "Remove connection error:",
          error
        );

        alert(
          error.message ||
            "Unable to remove connection"
        );
      } finally {
        setRemovingConnection(
          false
        );
      }
    };

  // =======================================================
  // BACK TO CHAT LIST
  // =======================================================

  const handleBackToChats =
    () => {
      setSelectedUser(null);

      setSelectedConnection(
        null
      );

      setSelectedConnectionId(
        null
      );

      setSelectedReceiverId(
        null
      );

      setMessages([]);

      setMessage("");

      setError("");

      setIsOtherUserOnline(
        false
      );

      setIsOtherUserTyping(
        false
      );

      setOtherUserLastSeen(
        null
      );

      navigate(
        "/chat",
        {
          replace: true,
        }
      );
    };

  // =======================================================
  // LOADING
  // =======================================================

  if (
    loadingCurrentUser
  ) {
    return (
      <main className="chat-page">

        <div className="chat-container">

          <div className="chat-empty">

            <div className="chat-empty-icon">
              💬
            </div>

            <h2>
              Loading chats...
            </h2>

            <p>
              Identifying your account...
            </p>

          </div>

        </div>

      </main>
    );
  }

  // =======================================================
  // CHAT LIST
  // =======================================================

  if (
    !selectedConnectionId
  ) {
    return (
      <main className="chat-page">

        <div className="chat-container">

          <header className="chat-header">

            <button
              type="button"
              className="chat-back"
              onClick={() =>
                navigate(
                  "/discover"
                )
              }
            >
              ←
            </button>

            <div className="chat-user">

              <div className="chat-avatar">
                💬
              </div>

              <div>

                <h1>
                  Chats
                </h1>

                <span>
                  Your connections
                </span>

              </div>

            </div>

          </header>

          <div className="chat-privacy">

            <span>
              🔒
            </span>

            <p>
              Your conversations are private.
            </p>

          </div>

          <div className="chat-messages">

            {loadingConnections ? (

              <div className="chat-empty">

                <div className="chat-empty-icon">
                  💬
                </div>

                <h2>
                  Loading chats...
                </h2>

              </div>

            ) : error ? (

              <div className="chat-empty">

                <div className="chat-empty-icon">
                  ⚠️
                </div>

                <h2>
                  Unable to load chats
                </h2>

                <p>
                  {error}
                </p>

              </div>

            ) : connections.length === 0 ? (

              <div className="chat-empty">

                <div className="chat-empty-icon">
                  💬
                </div>

                <h2>
                  No chats yet
                </h2>

                <p>
                  Accepted connections will appear here.
                </p>

              </div>

            ) : (

              <div className="chat-list">

                {connections.map(
                  (connection) => {
                    const user =
                      getOtherUser(
                        connection
                      );

                    if (
                      !getId(user)
                    ) {
                      return null;
                    }

                    return (
                      <article
                        key={
                          getId(
                            connection
                          )
                        }
                        className="request-card"
                      >

                        <div className="request-photo">

                          {user.photo ? (

                            <img
                              src={
                                user.photo
                              }
                              alt={
                                user.username ||
                                "User"
                              }
                            />

                          ) : (

                            <div className="request-photo-fallback">

                              {user.username
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "?"}

                            </div>

                          )}

                        </div>

                        <div className="request-user-info">

                          <h3>
                            {user.username ||
                              "Unknown user"}
                          </h3>

                          <p>
                            {user.gender ||
                              ""}
                          </p>

                          {user.category && (
                            <span>
                              {user.category}
                            </span>
                          )}

                          <small>
                            Connected
                          </small>

                        </div>

                        <div className="request-pending">

                          <button
                            type="button"
                            className="accept-button"
                            onClick={() =>
                              handleOpenChat(
                                connection
                              )
                            }
                          >
                            Chat
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

          <nav className="requests-bottom-nav">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/discover"
                )
              }
            >
              <span>◉</span>
              Discover
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/requests"
                )
              }
            >
              <span>♧</span>
              Requests
            </button>

            <button
              type="button"
              className="active"
            >
              <span>○</span>
              Chats
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >
              <span>♙</span>
              Profile
            </button>

          </nav>

        </div>

      </main>
    );
  }

  // =======================================================
  // ACTUAL CHAT
  // =======================================================

  return (
    <main className="chat-page">

      <div className="chat-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="chat-header">

          <button
            type="button"
            className="chat-back"
            onClick={
              handleBackToChats
            }
          >
            ←
          </button>

          <div className="chat-user">

            <div className="chat-avatar">

              {selectedUser?.photo ? (

                <img
                  src={
                    selectedUser.photo
                  }
                  alt={
                    selectedUser.username ||
                    "User"
                  }
                />

              ) : (

                selectedUser?.username
                  ?.charAt(0)
                  ?.toUpperCase() ||
                "?"

              )}

            </div>

            <div>

              <h1>
                {selectedUser?.username ||
                  "User"}
              </h1>

              {/* =====================================
                  ONLINE / OFFLINE / TYPING
              ====================================== */}

              {isOtherUserTyping ? (

                <span className="chat-typing-status">
                  typing...
                </span>

              ) : isOtherUserOnline ? (

                <span className="chat-online-status">
                  <span className="chat-online-dot"></span>
                  Online
                </span>

              ) : (

                <span className="chat-offline-status">
                  {formatLastSeen(
                    otherUserLastSeen
                  )}
                </span>

              )}

            </div>

          </div>

          <button
            type="button"
            className="chat-menu"
            onClick={() =>
              setShowMenu(
                (previous) =>
                  !previous
              )
            }
          >
            ⋮
          </button>

        </header>

        {/* =================================================
            MENU
        ================================================= */}

        {showMenu && (

          <div className="chat-menu-dropdown">

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);

                setShowRemoveModal(
                  true
                );
              }}
            >
              Remove connection
            </button>

          </div>

        )}

        {/* =================================================
            PRIVACY
        ================================================= */}

        <div className="chat-privacy">

          <span>
            🔒
          </span>

          <p>
            This conversation is private.
          </p>

        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

        <div className="chat-messages">

          {loadingMessages ? (

            <div className="chat-empty">

              <div className="chat-empty-icon">
                💬
              </div>

              <h2>
                Loading conversation...
              </h2>

            </div>

          ) : error ? (

            <div className="chat-empty">

              <div className="chat-empty-icon">
                ⚠️
              </div>

              <h2>
                Unable to load chat
              </h2>

              <p>
                {error}
              </p>

            </div>

          ) : messages.length === 0 ? (

            <div className="chat-empty">

              <div className="chat-empty-icon">
                💬
              </div>

              <h2>
                Start a conversation
              </h2>

              <p>
                Send a message to{" "}
                {selectedUser?.username ||
                  "this user"}.
              </p>

            </div>

          ) : (

            messages.map(
              (msg) => {
                const isMe =
                  getId(
                    msg.sender
                  ) ===
                  getId(
                    currentUserId
                  );

                return (
                  <div
                    key={
                      msg._id
                    }
                    className={
                      `message-row ${
                        isMe
                          ? "message-row-me"
                          : "message-row-other"
                      }`
                    }
                  >

                    <div
                      className={
                        `message-bubble ${
                          isMe
                            ? "message-bubble-me"
                            : "message-bubble-other"
                        }`
                      }
                    >

                      <div>
                        {msg.text}
                      </div>

                      <small>

                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",

                            minute:
                              "2-digit",
                          }
                        )}

                        {isMe &&
                          msg.isRead && (
                            <span>
                              {" "}✓✓
                            </span>
                          )}

                        {msg.isSavedAsEvidence && (
                          <span>
                            {" "}🔒
                          </span>
                        )}

                      </small>

                    </div>

                  </div>
                );
              }
            )

          )}

          <div
            ref={
              messagesEndRef
            }
          />

        </div>

        {/* =================================================
            TYPING INDICATOR
        ================================================= */}

        {isOtherUserTyping && (

          <div className="chat-typing-indicator">

            <span className="chat-typing-dot"></span>
            <span className="chat-typing-dot"></span>
            <span className="chat-typing-dot"></span>

          </div>

        )}

        {/* =================================================
            INPUT
        ================================================= */}

        <div className="chat-input-area">

          <textarea
            value={message}
            onChange={(event) => {
              const value =
                event.target.value;

              setMessage(value);

              handleTyping(value);
            }}
            onKeyDown={
              handleKeyDown
            }
            placeholder={
              `Message ${
                selectedUser?.username ||
                "user"
              }...`
            }
            rows={1}
            maxLength={2000}
            disabled={sending}
          />

          <button
            type="button"
            className="chat-send"
            onClick={
              handleSend
            }
            disabled={
              !message.trim() ||
              sending
            }
          >
            {sending
              ? "..."
              : "↑"}
          </button>

        </div>

        {/* =================================================
            REPORT
        ================================================= */}

        <button
          type="button"
          className="chat-report"
          onClick={
            handleReportConversation
          }
        >
          Report conversation
        </button>

        {/* =================================================
            SAFETY PROMPT
        ================================================= */}

        {showSafetyPrompt && (

          <div className="modal-overlay">

            <div className="modal-card">

              <h2>
                Safety notice
              </h2>

              <p>
                {safetyMessage}
              </p>

              <div className="profile-actions">

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    handleSaveConversation
                  }
                >
                  Save Conversation
                </button>

                <button
                  type="button"
                  className="profile-not-interested"
                  onClick={
                    handleDismissSafety
                  }
                >
                  Not Now
                </button>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            REMOVE CONNECTION MODAL
        ================================================= */}

        {showRemoveModal && (

          <div className="modal-overlay">

            <div className="modal-card">

              <h2>
                Remove connection?
              </h2>

              <p>
                You will no longer be able
                to continue this chat unless
                a new connection is created.
              </p>

              <div className="profile-actions">

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    handleRemoveConnection
                  }
                  disabled={
                    removingConnection
                  }
                >
                  {removingConnection
                    ? "Removing..."
                    : "Remove"}
                </button>

                <button
                  type="button"
                  className="profile-not-interested"
                  onClick={() =>
                    setShowRemoveModal(
                      false
                    )
                  }
                  disabled={
                    removingConnection
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  );
};

export default Chat;