
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";


const AboutYou = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // InterestCategory se aaya hua data
  const previousData = location.state?.profileData || {};

  const [about, setAbout] = useState(
    previousData.about || ""
  );

  const [interests, setInterests] = useState(
    previousData.interests || []
  );

  const [loading, setLoading] = useState(false);

  const interestOptions = [
    "Music",
    "Movies",
    "Gaming",
    "Travel",
    "Sports",
    "Books",
  ];


  // ==========================================
  // SELECT / UNSELECT INTEREST
  // ==========================================

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };


  // ==========================================
  // SAVE ABOUT + INTERESTS
  // ==========================================

  const handleNext = async () => {
    if (!about.trim() || interests.length === 0 || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
  "/profile/about",
        {
          about: about.trim(),
          interests,
        },
        {
          withCredentials: true,
        }
      );


      if (response.data.success) {

        const updatedProfileData = {
          ...previousData,
          about: about.trim(),
          interests,
        };


        console.log(
          "ABOUT + INTERESTS SAVED:",
          response.data.user
        );


        // ======================================
        // LOYAL → ABOUT YOU STEP 1
        // ======================================

        if (previousData.category === "loyal") {

          navigate("/about-you-step-1", {
            state: {
              profileData: updatedProfileData,
            },
          });

          return;
        }


        // ======================================
        // CASUAL → ABOUT YOU STEP 2
        // ======================================

        if (previousData.category === "casual") {

          navigate("/about-you-step-2", {
            state: {
              profileData: updatedProfileData,
            },
          });

          return;
        }
      }

    } catch (error) {

      console.error(
        "About update failed:",
        error.response?.data || error.message
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="about-page">
      <div className="about-container">


        {/* BACK */}

        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/interest-category")}
        >
          ←
        </button>


        {/* HEADER */}

        <section className="about-header">

          <div className="about-mini-ghost">
            <div className="about-ghost">

              <div className="about-ghost-eyes">
                <span></span>
                <span></span>
              </div>

              <div className="about-ghost-mouth"></div>

              <div className="about-ghost-bottom">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          </div>


          <p className="about-step">
            STEP 3 OF 4
          </p>


          <h1>
            Tell us a little
            <span> about yourself</span>
          </h1>


          <p className="about-subtitle">
            Help people understand who you are
            and what you enjoy.
          </p>

        </section>


        {/* ABOUT FORM */}

        <section className="about-form">

          <div className="about-field">

            <label htmlFor="about">
              About you
            </label>


            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell something interesting about yourself..."
              maxLength={300}
            />


            <div className="about-counter">
              {about.length}/300
            </div>

          </div>


          {/* INTERESTS */}

          <div className="about-interest-section">

            <div className="about-interest-heading">

              <label>
                Your interests
              </label>

              <span>
                Choose at least one
              </span>

            </div>


            <div className="about-interest-grid">

              {interestOptions.map((interest) => (

                <button
                  key={interest}
                  type="button"
                  className={`about-interest ${
                    interests.includes(interest)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleInterest(interest)}
                >

                  {interest}


                  {interests.includes(interest) && (
                    <span className="interest-check">
                      ✓
                    </span>
                  )}

                </button>

              ))}

            </div>

          </div>

        </section>


        {/* BOTTOM */}

        <div className="about-bottom">

          <button
            type="button"
            className="primary-button"
            disabled={
              !about.trim() ||
              interests.length === 0 ||
              loading
            }
            onClick={handleNext}
          >
            {loading ? "Saving..." : "Continue"}
          </button>


          <p className="about-note">
            You can change these details later.
          </p>

        </div>

      </div>
    </main>
  );
};

export default AboutYou;

