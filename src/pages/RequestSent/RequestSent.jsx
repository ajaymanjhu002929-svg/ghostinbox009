import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RequestSent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // DATA FROM PROFILE
  // ==========================================

  const user = location.state?.user;
  const request = location.state?.request;

  // ==========================================
  // IF PAGE OPENED DIRECTLY
  // ==========================================

  if (!user && !request) {
    return (
      <main className="request-sent-page">
        <div className="request-sent-container">

          <button
            type="button"
            className="page-back request-back"
            onClick={() => navigate("/discover")}
          >
            ←
          </button>

          <section className="request-sent-content">

            <div className="request-sent-icon">
              <div className="paper-plane">
                ➤
              </div>
            </div>

            <h1>
              Request Sent
            </h1>

            <p className="request-sent-message">
              Request information is not available.
            </p>

          </section>

          <div className="request-sent-bottom">

            <button
              type="button"
              className="request-discover-button"
              onClick={() => navigate("/discover")}
            >
              Back to Discover
            </button>

          </div>

        </div>
      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="request-sent-page">

      <div className="request-sent-container">

        {/* ======================================
            BACK
        ====================================== */}

        <button
          type="button"
          className="page-back request-back"
          onClick={() => navigate("/discover")}
        >
          ←
        </button>


        {/* ======================================
            SUCCESS CONTENT
        ====================================== */}

        <section className="request-sent-content">

          {/* SUCCESS ICON */}

          <div className="request-sent-icon">

            <div className="paper-plane">
              ➤
            </div>

            <span className="spark spark-one">
              ✦
            </span>

            <span className="spark spark-two">
              ✦
            </span>

            <span className="spark spark-three">
              +
            </span>

          </div>


          {/* TITLE */}

          <h1>
            Request Sent! 🎉
          </h1>


          {/* MESSAGE */}

          <p className="request-sent-message">

            Your request has been sent

            {user?.username
              ? ` to ${user.username}`
              : ""}

            successfully.

          </p>


          {/* ======================================
              REQUEST STATUS
          ====================================== */}

          <div className="request-sent-status">

            <span className="request-status-dot"></span>

            <span>
              Request Pending
            </span>

          </div>


          {/* ======================================
              REQUEST ID
          ====================================== */}

          {request?._id && (
            <small className="request-id">
              Request sent successfully
            </small>
          )}

        </section>


        {/* ======================================
            ACTION
        ====================================== */}

        <div className="request-sent-bottom">

          <button
            type="button"
            className="request-discover-button"
            onClick={() => navigate("/discover")}
          >
            Back to Discover
          </button>

        </div>

      </div>

    </main>
  );
};

export default RequestSent;