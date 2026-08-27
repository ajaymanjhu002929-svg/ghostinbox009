
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";


const AboutYouStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const previousData = location.state?.profileData || {};

  const [personType, setPersonType] = useState(
    previousData.lookingFor || ""
  );

  const [qualities, setQualities] = useState(
    previousData.qualities || []
  );

  const [loading, setLoading] = useState(false);

  const qualityOptions = [
    "Long-Term",
    "Trust",
    "Loyalty",
    "Good Communication",
    "Understanding",
    "Respect",
  ];


  // ==========================================
  // SELECT / UNSELECT QUALITY
  // ==========================================

  const toggleQuality = (quality) => {
    setQualities((prev) =>
      prev.includes(quality)
        ? prev.filter((item) => item !== quality)
        : [...prev, quality]
    );
  };


  // ==========================================
  // FINISH PROFILE
  // ==========================================

  const handleFinish = async () => {
    if (!personType || qualities.length === 0 || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
  "/profile/preferences",
        {
          lookingFor: personType,
          qualities,
        },
        {
          withCredentials: true,
        }
      );


      if (response.data.success) {

        const completeProfile = {
          ...previousData,
          lookingFor: personType,
          qualities,
          isProfileComplete: true,
        };


        console.log(
          "COMPLETE PROFILE:",
          response.data.user
        );


        navigate("/discover", {
          state: {
            profileData: completeProfile,
          },
        });
      }

    } catch (error) {

      console.error(
        "Preferences update failed:",
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
          onClick={() => navigate("/about-you")}
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
            STEP 4 OF 4
          </p>


          <h1>
            What kind of person
            <span> are you looking for?</span>
          </h1>


          <p className="about-subtitle">
            Tell us what matters to you.
            We'll use this to find better matches.
          </p>

        </section>


        {/* FORM */}

        <section className="about-form">


          {/* LOOKING FOR */}

          <div className="about-field">

            <label htmlFor="person-type">
              Looking for
            </label>


            <select
              id="person-type"
              value={personType}
              onChange={(e) => setPersonType(e.target.value)}
              className="about-select"
            >

              <option value="">
                Select one
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

            </select>

          </div>


          {/* QUALITIES */}

          <div className="about-interest-section">

            <div className="about-interest-heading">

              <label>
                Important qualities
              </label>

              <span>
                Choose at least one
              </span>

            </div>


            <div className="about-interest-grid">

              {qualityOptions.map((quality) => (

                <button
                  key={quality}
                  type="button"
                  className={`about-interest ${
                    qualities.includes(quality)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleQuality(quality)}
                >

                  {quality}


                  {qualities.includes(quality) && (
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
              !personType ||
              qualities.length === 0 ||
              loading
            }
            onClick={handleFinish}
          >
            {loading ? "Saving..." : "Finish Profile"}
          </button>


          <p className="about-note">
            We'll never publicly show your preferences.
          </p>

        </div>

      </div>
    </main>
  );
};

export default AboutYouStep1;

