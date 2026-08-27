
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const InterestCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const previousData = location.state?.profileData || {};

  const [category, setCategory] = useState(
    previousData.category || ""
  );

  const [loading, setLoading] = useState(false);


  // ==========================================
  // SAVE CATEGORY
  // ==========================================

  const handleContinue = async () => {
    if (!category || loading) return;

    try {
      setLoading(true);

      const response = await api.put(
  "/profile/category",
        {
          category,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {

        // Backend se updated user mil gaya
        console.log(
          "CATEGORY SAVED:",
          response.data.user
        );

        // Ab next common About You page
        navigate("/about-you", {
          state: {
            profileData: {
              ...previousData,
              category,
            },
          },
        });
      }

    } catch (error) {

      console.error(
        "Category update failed:",
        error.response?.data || error.message
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="interest-page">
      <div className="interest-container">

        <button
          type="button"
          className="page-back"
          onClick={() => navigate("/create-profile")}
          aria-label="Go back"
        >
          ←
        </button>


        <section className="interest-header">

          <div className="interest-mini-ghost">
            <div className="interest-ghost">

              <div className="interest-ghost-eyes">
                <span></span>
                <span></span>
              </div>

              <div className="interest-ghost-mouth"></div>

              <div className="interest-ghost-bottom">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          </div>


          <p className="interest-step">
            STEP 2 OF 4
          </p>


          <h1>
            What kind of connection
            <span> are you looking for?</span>
          </h1>


          <p className="interest-subtitle">
            Choose what feels right for you.
            You can always change this later.
          </p>

        </section>


        <section className="interest-options">

          {/* LOYAL */}

          <button
            type="button"
            className={`interest-card ${
              category === "loyal"
                ? "selected"
                : ""
            }`}
            onClick={() => setCategory("loyal")}
          >

            <div className="interest-icon loyal-icon">
              ♡
            </div>


            <div className="interest-card-content">

              <h2>
                Loyal Friendship
              </h2>

              <p>
                Meaningful conversations,
                trust and a genuine connection.
              </p>

            </div>


            <div className="interest-radio">
              <span></span>
            </div>

          </button>


          {/* CASUAL */}

          <button
            type="button"
            className={`interest-card ${
              category === "casual"
                ? "selected"
                : ""
            }`}
            onClick={() => setCategory("casual")}
          >

            <div className="interest-icon casual-icon">
              ✦
            </div>


            <div className="interest-card-content">

              <h2>
                Casual Connection
              </h2>

              <p>
                Keep things relaxed, private
                and without serious commitment.
              </p>

            </div>


            <div className="interest-radio">
              <span></span>
            </div>

          </button>

        </section>


        <div className="interest-bottom">

          <button
            type="button"
            className="primary-button"
            disabled={!category || loading}
            onClick={handleContinue}
          >
            {loading ? "Saving..." : "Continue"}
          </button>


          <p className="interest-note">
            Your choice helps us show you
            better connections.
          </p>

        </div>

      </div>
    </main>
  );
};

export default InterestCategory;

