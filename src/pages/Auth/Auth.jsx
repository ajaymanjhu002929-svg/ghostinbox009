
import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../../components/auth/GoogleButton";

const Auth = () => {
  const navigate = useNavigate();

  const handleGoogleContinue = () => {
    window.location.href =
      "https://ghostinbox09.onrender.com/api/auth/google";
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* BACK */}
        <button
          type="button"
          className="auth-back"
          onClick={() => navigate("/")}
        >
          ←
        </button>


        {/* HEADER */}
        <section className="auth-header">

          <h1>
            Welcome Back <span>👋</span>
          </h1>

          <p>
            Login or register to continue
          </p>

        </section>


        {/* GOOGLE LOGIN */}
        <section className="auth-actions">

          <GoogleButton
            variant="light"
            onClick={handleGoogleContinue}
          >
            Continue with Google
          </GoogleButton>

          <p className="auth-google-note">
            We never post on Google
          </p>

        </section>


        {/* FOOTER */}
        <section className="auth-footer">

          <p>
            By continuing, you agree to our
          </p>

          <div className="auth-links">

            <button type="button">
              Terms &amp; Conditions
            </button>

            <span>
              and
            </span>

            <button type="button">
              Privacy Policy
            </button>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Auth;

