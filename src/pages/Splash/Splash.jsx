import React from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <main className="splash-page">

      {/* Decorative background glow */}
      <div className="splash-glow splash-glow-one"></div>
      <div className="splash-glow splash-glow-two"></div>

      <div className="splash-container">

        {/* Ghost */}
        <div className="splash-logo">

          <div className="ghost-orb">

            <div className="ghost">
              <div className="ghost-eyes">
                <span></span>
                <span></span>
              </div>

              <div className="ghost-mouth"></div>

              <div className="ghost-arm ghost-arm-left"></div>
              <div className="ghost-arm ghost-arm-right"></div>

              <div className="ghost-bottom">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

          </div>

        </div>


        {/* Brand */}
        <div className="splash-brand">

          <h1>
            GHOST <span>INBOX</span>
          </h1>

          <p>
            Real people. Real connections.
            <br />
            Private &amp; Safe.
          </p>

        </div>


        {/* Action */}
        <div className="splash-action">

          <button
            className="primary-button splash-button"
            onClick={handleGetStarted}
          >
            Get Started
          </button>

        </div>


        {/* Privacy */}
        <div className="splash-privacy">

          <span className="privacy-lock">♙</span>

          <span>
            Your privacy is our priority
          </span>

        </div>

      </div>

    </main>
  );
};

export default Splash;