import { authFetch } from "../../services/api";
import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const API =
  "https://ghostinbox09.onrender.com/api";

const Requests = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("received");

  const [receivedRequests, setReceivedRequests] =
    useState([]);

  const [sentRequests, setSentRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  // ==================================================
  // LOAD REQUESTS
  // ==================================================

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await authFetch(
        `${API}/requests`,
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
            "Failed to load requests"
        );
      }

      const allRequests =
        data.requests || [];

      const received =
        allRequests.filter(
          (request) =>
            request.type === "received" &&
            request.status === "pending"
        );

      const sent =
        allRequests.filter(
          (request) =>
            request.type === "sent"
        );

      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (error) {
      console.error(
        "Requests error:",
        error
      );

      setReceivedRequests([]);
      setSentRequests([]);

      alert(
        error.message ||
          "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadRequests();
  }, []);

  // ==================================================
  // GET REQUEST USER
  // ==================================================

  const getRequestUser = (
    request
  ) => {
    return (
      request?.user ||
      request?.sender ||
      request?.receiver ||
      null
    );
  };

  // ==================================================
  // ACCEPT REQUEST
  // ==================================================

  const handleAccept = async (
    request
  ) => {
    if (!request?._id) {
      return;
    }

    try {
      setActionLoading(
        request._id
      );

      const response = await authFetch(
        `${API}/requests/${request._id}/accept`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to accept request"
        );
      }

      const connectedUser =
        getRequestUser(request);

      const connection =
        data.connection || null;

      if (!connection?._id) {
        alert(
          "Request accepted, but connection ID was not returned."
        );

        await loadRequests();
        return;
      }

      setReceivedRequests(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              request._id
          )
      );

      // ==================================================
      // GO TO CONNECTED PAGE
      // ==================================================

      navigate("/connected", {
        state: {
          user: connectedUser,
          connection,
          connectionId:
            connection._id,
          receiverId:
            connectedUser?._id,
          request:
            data.request,
        },
      });
    } catch (error) {
      console.error(
        "Accept request error:",
        error
      );

      alert(
        error.message ||
          "Failed to accept request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==================================================
  // DECLINE REQUEST
  // ==================================================

  const handleDecline = async (
    request
  ) => {
    if (!request?._id) {
      return;
    }

    try {
      setActionLoading(
        request._id
      );

      const response = await authFetch(
        `${API}/requests/${request._id}/reject`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reject request"
        );
      }

      setReceivedRequests(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              request._id
          )
      );
    } catch (error) {
      console.error(
        "Decline request error:",
        error
      );

      alert(
        error.message ||
          "Failed to decline request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==================================================
  // OPEN PROFILE
  // ==================================================

  const handleProfile = (
    request
  ) => {
    const user =
      getRequestUser(request);

    if (!user?._id) {
      return;
    }

    navigate(
      `/profile/${user._id}`,
      {
        state: {
          user,
        },
      }
    );
  };

  // ==================================================
  // ACTIVE REQUEST LIST
  // ==================================================

  const visibleRequests =
    activeTab === "received"
      ? receivedRequests
      : sentRequests;

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="requests-page">

      <div className="requests-container">

        {/* HEADER */}

        <header className="requests-header">

          <div>

            <h1>
              Requests
            </h1>

            <p>
              Manage your connection requests
            </p>

          </div>

          <button
            type="button"
            className="requests-close"
            onClick={() =>
              navigate("/discover")
            }
          >
            ×
          </button>

        </header>

        {/* TABS */}

        <div className="requests-tabs">

          <button
            type="button"
            className={
              activeTab === "received"
                ? "request-tab active"
                : "request-tab"
            }
            onClick={() =>
              setActiveTab(
                "received"
              )
            }
          >
            Received

            {receivedRequests.length >
              0 && (
              <span>
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={
              activeTab === "sent"
                ? "request-tab active"
                : "request-tab"
            }
            onClick={() =>
              setActiveTab("sent")
            }
          >
            Sent

            {sentRequests.length >
              0 && (
              <span>
                {sentRequests.length}
              </span>
            )}
          </button>

        </div>

        {/* REQUEST LIST */}

        <section className="requests-list">

          {/* LOADING */}

          {loading && (
            <div className="requests-status">

              <div className="requests-loader"></div>

              <p>
                Loading requests...
              </p>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            visibleRequests.length ===
              0 && (
              <div className="requests-status">

                <div className="requests-empty-icon">
                  ♡
                </div>

                <h2>
                  No requests yet
                </h2>

                <p>
                  {activeTab ===
                  "received"
                    ? "When someone sends you a request, it will appear here."
                    : "Requests you send will appear here."}
                </p>

              </div>
            )}

          {/* REQUESTS */}

          {!loading &&
            visibleRequests.map(
              (request) => {

                const user =
                  getRequestUser(
                    request
                  );

                const isProcessing =
                  actionLoading ===
                  request._id;

                return (
                  <article
                    className="request-card"
                    key={request._id}
                    onClick={() =>
                      handleProfile(
                        request
                      )
                    }
                  >

                    {/* PHOTO */}

                    <div className="request-photo">

                      {user?.photo ? (
                        <img
                          src={user.photo}
                          alt={
                            user.username ||
                            "User"
                          }
                        />
                      ) : (
                        <div className="request-photo-fallback">
                          {user?.username
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase() ||
                            "?"}
                        </div>
                      )}

                    </div>

                    {/* USER INFO */}

                    <div className="request-user-info">

                      <h3>
                        {user?.username ||
                          "Unknown user"}
                      </h3>

                      <p>
                        {user?.gender ||
                          ""}

                        {user?.age
                          ? ` • ${user.age}`
                          : ""}
                      </p>

                      {user?.category && (
                        <span>
                          {user.category}
                        </span>
                      )}

                      {request.createdAt && (
                        <small>
                          {new Date(
                            request.createdAt
                          ).toLocaleDateString()}
                        </small>
                      )}

                    </div>

                    {/* RECEIVED ACTIONS */}

                    {activeTab ===
                    "received" ? (

                      <div
                        className="request-actions"
                        onClick={(
                          event
                        ) =>
                          event.stopPropagation()
                        }
                      >

                        <button
                          type="button"
                          className="decline-button"
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            handleDecline(
                              request
                            )
                          }
                        >
                          {isProcessing
                            ? "..."
                            : "Decline"}
                        </button>

                        <button
                          type="button"
                          className="accept-button"
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            handleAccept(
                              request
                            )
                          }
                        >
                          {isProcessing
                            ? "..."
                            : "Accept"}
                        </button>

                      </div>

                    ) : (

                      /* SENT STATUS */

                      <div
                        className="request-pending"
                        onClick={(
                          event
                        ) =>
                          event.stopPropagation()
                        }
                      >

                        {request.status ===
                        "accepted" ? (
                          <span>
                            Accepted
                          </span>
                        ) : request.status ===
                          "rejected" ? (
                          <span>
                            Rejected
                          </span>
                        ) : (
                          <span>
                            Pending
                          </span>
                        )}

                      </div>

                    )}

                  </article>
                );
              }
            )}

        </section>

        {/* BOTTOM NAV */}

        <nav className="requests-bottom-nav">

          <button
            type="button"
            onClick={() =>
              navigate("/discover")
            }
          >
            <span>◉</span>
            Discover
          </button>

          <button
            type="button"
            className="active"
          >
            <span>♧</span>
            Requests
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/chat")
            }
          >
            <span>○</span>
            Chats
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span>♙</span>
            Profile
          </button>

        </nav>

      </div>

    </main>
  );
};

export default Requests;