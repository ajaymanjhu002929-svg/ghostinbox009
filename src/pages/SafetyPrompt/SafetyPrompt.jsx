import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const SafetyPrompt = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const state =
    location.state || {};

  const user =
    state.user || null;

  const connection =
    state.connection || null;

  const connectionId =
    state.connectionId ||
    connection?._id ||
    connection?.id ||
    null;

  const receiverId =
    state.receiverId ||
    user?._id ||
    user?.id ||
    null;

  const messageIds =
    Array.isArray(
      state.messageIds
    )
      ? state.messageIds
      : [];

  const category =
    state.category ||
    "harmful_content";

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = () => {

    if (!connectionId) {
      alert(
        "Connection not found."
      );
      return;
    }

    navigate(
      "/end-connection",
      {
        state: {
          user,
          connection,
          connectionId,
          receiverId,
          messageIds,
          category,
          saveEvidence:
            true,
        },
      }
    );
  };

  // ==========================================================
  // DON'T SAVE
  // ==========================================================

  const handleDontSave = () => {

    navigate(
      "/chat",
      {
        state: {
          user,
          connection,
          connectionId,
          receiverId,
        },
      }
    );
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {

    navigate(
      "/chat",
      {
        state: {
          user,
          connection,
          connectionId,
          receiverId,
        },
      }
    );
  };

  return (
    <main className="harassment-page">

      <div className="harassment-container">

        <button
          type="button"
          className="page-back"
          onClick={handleBack}
        >
          ←
        </button>

        <section className="harassment-header">

          <div className="harassment-icon">
            <span>!</span>
          </div>

          <h1>
            This conversation may contain
            <span>
              {" "}
              inappropriate or harmful content.
            </span>
          </h1>

          <p>
            Would you like to save this chat as
            evidence for future reports?
          </p>

        </section>

        <section className="harassment-actions">

          <button
            type="button"
            className="harassment-save-button"
            onClick={handleSave}
          >
            Save Chat as Evidence
          </button>

          <button
            type="button"
            className="harassment-dont-save"
            onClick={handleDontSave}
          >
            Don't Save
          </button>

        </section>

        <p className="harassment-note">
          This will help us keep our community safe.
        </p>

      </div>

    </main>
  );
};

export default SafetyPrompt;