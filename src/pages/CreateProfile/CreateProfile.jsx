
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = async () => {
    if (!username.trim() || !gender) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.put("/profile", {
        username: username.trim(),
        gender,
      });

      console.log("PROFILE UPDATE RESPONSE:", response.data);

      if (response.data.success) {
        navigate("/interest-category", {
          state: {
            profileData: {
              username: username.trim(),
              gender,
            },
          },
        });
      }

    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Profile save nahi ho paya"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="profile-page">
      <div className="profile-container">

        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/auth")}
          aria-label="Go back"
        >
          ←
        </button>


        <section className="profile-header">

          <h1>Create Your Profile</h1>

          <p>
            Just a few details to get started
          </p>

        </section>


        <section className="profile-form">


          {/* =========================
              AVATAR
          ========================= */}

          <div className="profile-avatar-upload">

            <div className="profile-avatar">

              <div className="profile-ghost">

                <div className="profile-ghost-eyes">
                  <span></span>
                  <span></span>
                </div>

                <div className="profile-ghost-mouth"></div>

                <div className="profile-ghost-arm profile-ghost-arm-left"></div>

                <div className="profile-ghost-arm profile-ghost-arm-right"></div>

                <div className="profile-ghost-bottom">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

            </div>


            <button
              type="button"
              className="avatar-camera"
              aria-label="Add profile picture"
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </button>

          </div>


          {/* =========================
              USERNAME
          ========================= */}

          <div className="form-field">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage("");
              }}
              maxLength={30}
            />

          </div>


          {/* =========================
              GENDER
          ========================= */}

          <div className="form-field">

            <label htmlFor="gender">
              Gender
            </label>

            <div className="select-wrapper">

              <select
                id="gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setErrorMessage("");
                }}
              >

                <option value="">
                  Select your gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

              </select>

              <span className="select-arrow">
                ⌄
              </span>

            </div>

          </div>


          {/* =========================
              ERROR
          ========================= */}

          {errorMessage && (
            <p
              style={{
                marginTop: "12px",
                color: "red",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </p>
          )}

        </section>


        {/* =========================
            NEXT BUTTON
        ========================= */}

        <div className="profile-bottom">

          <button
            type="button"
            className="primary-button"
            onClick={handleNext}
            disabled={
              !username.trim() ||
              !gender ||
              loading
            }
          >
            {loading ? "Saving..." : "Next"}
          </button>

        </div>

      </div>
    </main>
  );
};

export default CreateProfile;

