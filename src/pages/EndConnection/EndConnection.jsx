import { authFetch } from "../../services/api";
import React, {
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const API_URL =
  "https://ghostinbox09.onrender.com/api";

const EndConnection = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ==========================================================
  // DATA
  // ==========================================================

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

  const messageIds =
    Array.isArray(
      state.messageIds
    )
      ? state.messageIds
      : [];

  const category =
    state.category ||
    "harmful_content";

  const saveEvidence =
    Boolean(
      state.saveEvidence
    );

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ==========================================================
  // REASONS
  // ==========================================================

  const reasons = [
    "Not interested anymore",
    "Didn't match my interests",
    "Communication issue",
    "Other",
  ];

  // ==========================================================
  // END CONNECTION
  // ==========================================================

  const handleEndConnection =
    async () => {

      if (!reason) {
        alert(
          "Please select a reason"
        );
        return;
      }

      if (!connectionId) {
        alert(
          "Connection ID not found"
        );
        return;
      }

      try {

        setLoading(true);

        // ======================================================
        // STEP 1
        // SAVE EVIDENCE
        // ======================================================

        if (saveEvidence) {

          const evidenceResponse =
            await authFetch(
              `${API_URL}/evidence`,
              {
                method:
                  "POST",

                credentials:
                  "include",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    connectionId,

                    messageIds,

                    category,
                  }),
              }
            );

          let evidenceData =
            {};

          try {
            evidenceData =
              await evidenceResponse.json();
          } catch {
            evidenceData =
              {};
          }

          if (
            !evidenceResponse.ok
          ) {
            throw new Error(
              evidenceData?.message ||
              "Failed to save evidence"
            );
          }

          console.log(
            "Evidence saved:",
            evidenceData
          );
        }

        // ======================================================
        // STEP 2
        // REMOVE CONNECTION
        // ======================================================

        const response =
          await authFetch(
            `${API_URL}/connections/${connectionId}`,
            {
              method:
                "DELETE",

              credentials:
                "include",
            }
          );

        let data =
          {};

        try {
          data =
            await response.json();
        } catch {
          data =
            {};
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
            "Failed to end connection"
          );
        }

        // ======================================================
        // SUCCESS
        // ======================================================

        navigate(
          "/discover",
          {
            replace:
              true,
          }
        );

      } catch (error) {

        console.error(
          "End connection error:",
          error
        );

        alert(
          error?.message ||
          "Failed to end connection"
        );

      } finally {

        setLoading(false);
      }
    };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {

    if (loading) {
      return;
    }

    navigate(
      "/chat",
      {
        state: {
          user,
          connection,
          connectionId,
        },
      }
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="end-connection-page">

      <div className="end-connection-container">

        <button
          type="button"
          className="page-back"
          onClick={handleBack}
          disabled={loading}
        >
          ←
        </button>

        <section className="end-connection-header">

          <h1>
            End Connection
          </h1>

          <p>
            Are you sure you want to
            end this connection?
          </p>

        </section>

        <section className="end-connection-card">

          <label>
            Please share your feedback (optional)
          </label>

          <div className="end-connection-options">

            {reasons.map(
              (item) => (

                <button
                  key={item}
                  type="button"
                  className={
                    `end-reason ${
                      reason === item
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setReason(item)
                  }
                  disabled={loading}
                >

                  <span className="end-radio">

                    {reason === item
                      ? "●"
                      : ""}

                  </span>

                  <span>
                    {item}
                  </span>

                </button>
              )
            )}

          </div>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(
                e.target.value
              )
            }
            placeholder="Additional feedback..."
            maxLength={200}
            disabled={loading}
          />

          <div className="end-feedback-counter">
            {feedback.length}/200
          </div>

        </section>

        <section className="end-connection-actions">

          <button
            type="button"
            className="end-connection-button"
            disabled={
              !reason ||
              loading
            }
            onClick={
              handleEndConnection
            }
          >
            {loading
              ? "Saving..."
              : "End Connection"}
          </button>

        </section>

      </div>

    </main>
  );
};

export default EndConnection;