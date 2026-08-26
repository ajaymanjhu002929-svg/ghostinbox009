import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "https://ghostinbox09.onrender.com/api";

const Connected = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==================================================
  // DATA FROM REQUESTS PAGE
  // ==================================================

  const stateUser = location.state?.user || null;
  const stateConnection = location.state?.connection || null;

  const stateConnectionId =
    location.state?.connectionId ||
    stateConnection?._id ||
    stateConnection?.id ||
    null;

  // ==================================================
  // STATES
  // ==================================================

  const [user, setUser] = useState(stateUser);
  const [connection, setConnection] = useState(stateConnection);
  const [connectionId, setConnectionId] =
    useState(stateConnectionId);

  const [receiverId, setReceiverId] = useState(
    location.state?.receiverId ||
      stateUser?._id ||
      null
  );

  const [loading, setLoading] = useState(
    !stateConnectionId
  );

  // ==================================================
  // LOAD CONNECTION
  // ==================================================

  useEffect(() => {
    const loadConnection = async () => {
      // Connection already received from Requests
      if (connectionId) {
        setLoading(false);
        return;
      }

      // Connected user missing
      if (!stateUser?._id) {
        console.error(
          "CONNECTED - USER ID NOT FOUND"
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${API}/connections`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load connections"
          );
        }

        const connections =
          data.connections ||
          data.data ||
          [];

        // Find connection containing this user
        const foundConnection =
          connections.find((item) => {
            const user1Id =
              item?.user1?._id ||
              item?.user1?.id ||
              item?.user1;

            const user2Id =
              item?.user2?._id ||
              item?.user2?.id ||
              item?.user2;

            return (
              user1Id?.toString() ===
                stateUser._id.toString() ||
              user2Id?.toString() ===
                stateUser._id.toString()
            );
          });

        if (!foundConnection) {
          alert(
            "Connection was not found."
          );

          return;
        }

        const foundConnectionId =
          foundConnection._id ||
          foundConnection.id ||
          null;

        if (!foundConnectionId) {
          alert(
            "Connection ID is missing."
          );

          return;
        }

        setConnection(foundConnection);
        setConnectionId(foundConnectionId);

        // ==================================================
        // FIND OTHER USER
        // ==================================================

        const user1Id =
          foundConnection?.user1?._id ||
          foundConnection?.user1?.id ||
          foundConnection?.user1;

        const user2Id =
          foundConnection?.user2?._id ||
          foundConnection?.user2?.id ||
          foundConnection?.user2;

        let chatUser = null;

        if (
          user1Id?.toString() ===
          stateUser._id.toString()
        ) {
          chatUser = foundConnection.user2;
        } else {
          chatUser = foundConnection.user1;
        }

        if (
          chatUser &&
          typeof chatUser === "object"
        ) {
          setUser(chatUser);

          setReceiverId(
            chatUser._id ||
              chatUser.id
          );
        } else {
          const otherId =
            user1Id?.toString() ===
            stateUser._id.toString()
              ? user2Id
              : user1Id;

          setReceiverId(otherId);
        }
      } catch (error) {
        console.error(
          "CONNECTED - LOAD ERROR:",
          error
        );

        alert(
          error.message ||
            "Unable to load connection"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConnection();
  }, []);

  // ==================================================
  // START CHAT
  // ==================================================

  const handleStartChat = () => {
    if (!connectionId) {
      alert(
        "Connection ID not found."
      );
      return;
    }

    if (!receiverId) {
      alert(
        "Receiver ID not found."
      );
      return;
    }

    if (!user?._id && !user?.id) {
      alert(
        "Connected user not found."
      );
      return;
    }

    navigate("/chat", {
      state: {
        user,
        connection,
        connectionId,
        receiverId,
      },
    });
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="connected-page">
      <div className="connected-container">

        <section className="connected-content">

          <div className="connected-icon">

            <div className="connected-ghost">
              <span></span>
              <span></span>
            </div>

            <div className="connected-check">
              ✓
            </div>

          </div>

          <h1>
            You're Connected!
          </h1>

          <p className="connected-subtitle">
            You and{" "}
            <strong>
              {user?.username ||
                "this person"}
            </strong>{" "}
            have accepted the connection.
          </p>

          {user && (
            <div className="connected-user">

              <div className="connected-avatar">

                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={
                      user.username ||
                      "User"
                    }
                  />
                ) : (
                  user.username
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "?"
                )}

              </div>

              <div>

                <h2>
                  {user.username ||
                    "User"}
                </h2>

                <p>
                  {user.gender || ""}

                  {user.age
                    ? ` • ${user.age}`
                    : ""}
                </p>

              </div>

            </div>
          )}

          <div className="connected-note">

            <span>✦</span>

            <p>
              You can now start a
              private conversation.
            </p>

          </div>

        </section>

        <section className="connected-actions">

          <button
            type="button"
            className="primary-button"
            onClick={handleStartChat}
            disabled={
              loading ||
              !connectionId ||
              !receiverId
            }
          >
            {loading
              ? "Finding Connection..."
              : "Start Chatting"}
          </button>

          <button
            type="button"
            className="connected-back"
            onClick={() =>
              navigate("/discover")
            }
          >
            Back to Discover
          </button>

        </section>

      </div>
    </main>
  );
};

export default Connected;