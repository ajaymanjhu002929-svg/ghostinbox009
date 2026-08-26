
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://ghostinbox09.onrender.com/api";

const HarassmentPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // DATA FROM CHAT
  // ==========================================

  const user = location.state?.user;

  const connection =
    location.state?.connection;

  const connectionId =
    location.state?.connectionId ||
    connection?._id ||
    connection?.id;

  const [saving, setSaving] = useState(false);

  // ==========================================
  // SAVE CHAT AS EVIDENCE
  // ==========================================

  const handleSave = async () => {
    if (!connectionId) {
      alert("Connection not found.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/messages/connection/${connectionId}/save-evidence`,
        {
          method: "PATCH",
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
            "Failed to save conversation"
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      navigate("/end-connection", {
        state: {
          user,
          connection,
          connectionId,
          saveEvidence: true,
        },
      });

    } catch (error) {
      console.error(
        "Save evidence error:",
        error
      );

      alert(
        error.message ||
          "Unable to save conversation"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DON'T SAVE
  // ==========================================

  const handleDontSave = () => {
    navigate("/chat", {
      state: {
        user,
        connection,
        connectionId,
      },
    });
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigate("/chat", {
      state: {
        user,
        connection,
        connectionId,
      },
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="harassment-page">

      <div className="harassment-container">

        {/* ================================
            BACK
        ================================= */}

        <button
          type="button"
          className="page-back"
          onClick={handleBack}
          disabled={saving}
        >
          ←
        </button>


        {/* ================================
            WARNING
        ================================= */}

        <section className="harassment-header">

          <div className="harassment-icon">
            <span>!</span>
          </div>

          <h1>
            This conversation may contain
            <span>
              {" "}inappropriate or harmful content.
            </span>
          </h1>

          <p>
            Would you like to save this chat as
            evidence for future reports?
          </p>

        </section>


        {/* ================================
            ACTIONS
        ================================= */}

        <section className="harassment-actions">

          <button
            type="button"
            className="harassment-save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Chat as Evidence"}
          </button>


          <button
            type="button"
            className="harassment-dont-save"
            onClick={handleDontSave}
            disabled={saving}
          >
            Don't Save
          </button>

        </section>


        {/* ================================
            NOTE
        ================================= */}

        <p className="harassment-note">
          This will help us keep our community safe.
        </p>

      </div>

    </main>
  );
};

export default HarassmentPrompt;

