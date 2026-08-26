import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const API_URL = "https://ghostinbox09.onrender.com/api";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const socket = useSocket();

  // ==========================================
  // MY PROFILE OR OTHER USER PROFILE
  // ==========================================

  const isMyProfile = !id;

  // ==========================================
  // PROFILE STATE
  // ==========================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // PROFILE MENU
  // ==========================================

  const [showMenu, setShowMenu] = useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const [loggingOut, setLoggingOut] = useState(false);

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const [deletingAccount, setDeletingAccount] = useState(false);

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const url = isMyProfile
          ? `${API_URL}/profile/me`
          : `${API_URL}/profile/${id}`;

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        setUser(data.user);
      } catch (error) {
        console.error("Profile error:", error);

        setUser(null);

        setError(
          error.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, isMyProfile]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setShowMenu(false);

      const response = await fetch(
        `${API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Logout response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Logout failed"
        );
      }

      navigate("/auth", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      alert(
        error.message || "Unable to logout"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // ==========================================
  // DELETE ACCOUNT FROM PROFILE MENU
  // ==========================================

  const handleDeleteClick = async () => {
    setShowMenu(false);

    const confirmed = window.confirm(
      "Delete your account permanently? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    await handleDeleteAccount();
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async () => {
    if (deletingAccount) {
      return;
    }

    try {
      setDeletingAccount(true);

      /*
       * IMPORTANT:
       * Backend route is:
       *
       * DELETE /api/auth/delete-account
       *
       * NOT:
       *
       * DELETE /api/profile
       */

      const response = await fetch(
        `${API_URL}/auth/delete-account`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Delete account response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete account"
        );
      }

      // ========================================
      // ACCOUNT DELETED SUCCESSFULLY
      // ========================================

      setUser(null);

      navigate("/auth", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete account"
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  // ==========================================
  // SEND REQUEST
  // ==========================================

  const handleSendRequest = async () => {
    try {
      if (!id) {
        alert("User ID is missing");
        return;
      }

      const response = await fetch(
        `${API_URL}/requests`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            receiverId: id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Send request response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send request"
        );
      }

      navigate("/request-sent", {
        state: {
          user,
          request:
            data.request ||
            data.data,
        },
      });
    } catch (error) {
      console.error(
        "Send request error:",
        error
      );

      alert(
        error.message ||
          "Unable to send request"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container profile-not-found">

          <div className="discover-loader"></div>

          <h2>
            Loading profile...
          </h2>

          <p>
            Getting profile from the server.
          </p>

        </div>
      </main>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!user) {
    return (
      <main className="profile-page">

        <div className="profile-container profile-not-found">

          <h2>
            Profile not available
          </h2>

          <p>
            {error ||
              "Profile data could not be loaded."}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/discover")
            }
          >
            Back to Discover
          </button>

        </div>

      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* =====================================
            BACK
        ====================================== */}

        <button
          type="button"
          className="page-back profile-back"
          onClick={() =>
            navigate("/discover")
          }
        >
          ←
        </button>

        {/* =====================================
            MORE MENU
        ====================================== */}

        {isMyProfile && (
          <div className="profile-menu-wrapper">

            <button
              type="button"
              className="profile-more"
              onClick={() =>
                setShowMenu(
                  (previous) =>
                    !previous
                )
              }
              aria-label="Profile menu"
            >
              ⋮
            </button>

            {/* =================================
                DROPDOWN
            ================================= */}

            {showMenu && (
              <div className="profile-menu-dropdown">

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  disabled={loggingOut}
                >
                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  className="profile-delete-option"
                  onClick={
                    handleDeleteClick
                  }
                >
                  Delete Account
                </button>

              </div>
            )}

          </div>
        )}

        {/* =====================================
            PROFILE
        ====================================== */}

        <section className="profile-preview">

          <div className="profile-photo">

            {user.photo ? (

              <img
                src={user.photo}
                alt={
                  user.username ||
                  "User"
                }
              />

            ) : (

              <div className="profile-photo-fallback">

                {user.username
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "?"}

              </div>

            )}

          </div>

          <h1>
            {user.username}
          </h1>

          <p className="profile-basic">

            {user.gender}

            {user.age
              ? ` • ${user.age}`
              : ""}

          </p>

          {user.category && (
            <span className="profile-category">
              {user.category}
            </span>
          )}

        </section>

        {/* =====================================
            ABOUT
        ====================================== */}

        <section className="profile-info-card">

          <h3>
            {isMyProfile
              ? "About Me"
              : "About Him"}
          </h3>

          <p>
            {user.about ||
              "No information added yet."}
          </p>

        </section>

        {/* =====================================
            INTERESTS
        ====================================== */}

        {user.interests?.length > 0 && (

          <section className="profile-info-card">

            <h3>
              My Interests
            </h3>

            <p>
              {user.interests.join(
                " • "
              )}
            </p>

          </section>

        )}

        {/* =====================================
            LOOKING FOR
        ====================================== */}

        <section className="profile-info-card">

          <h3>
            Looking For
          </h3>

          <p>
            {user.lookingFor ||
              "No preferences added yet."}
          </p>

        </section>

        {/* =====================================
            QUALITIES
        ====================================== */}

        {user.qualities?.length > 0 && (

          <section className="profile-info-card">

            <h3>
              Important Qualities
            </h3>

            <p>
              {user.qualities.join(
                " • "
              )}
            </p>

          </section>

        )}

        {/* =====================================
            ACTIONS
        ====================================== */}

        {isMyProfile ? (

          <section className="profile-actions">

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/create-profile"
                )
              }
            >
              Edit Profile
            </button>

          </section>

        ) : (

          <section className="profile-actions">

            <button
              type="button"
              className="primary-button"
              onClick={
                handleSendRequest
              }
            >
              Send Request
            </button>

            <button
              type="button"
              className="profile-not-interested"
              onClick={() =>
                navigate("/discover")
              }
            >
              Not Interested
            </button>

          </section>

        )}



      </div>

    </main>
  );
};

export default Profile;