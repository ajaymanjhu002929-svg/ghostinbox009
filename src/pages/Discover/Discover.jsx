import { authFetch } from "../../services/api";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ghostinbox09.onrender.com/api";

const FILTERS = [
  { key: "all", label: "All", icon: "✦" },
  { key: "loyal", label: "Loyal", icon: "♥" },
  { key: "casual", label: "Casual", icon: "✹" },
];

const Discover = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(search, activeFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, activeFilter]);

  const loadUsers = async (searchValue = "", category = "all") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      if (category !== "all") {
        params.set("category", category);
      }

      const query = params.toString();

      const url = query
        ? `${API_URL}/discover?${query}`
        : `${API_URL}/discover`;

      console.log("DISCOVER URL:", url);

      const response = await authFetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("DISCOVER STATUS:", response.status);
      console.log("DISCOVER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error("Discover error:", error);

      setUsers([]);

      setError(
        error.message ||
          "Failed to load discover users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================
  // FILTER
  // ==========================================

  const handleFilter = (filter) => {
    if (filter === activeFilter) return;

    setActiveFilter(filter);
  };

  // ==========================================
  // PROFILE
  // ==========================================

  const handleProfile = (user) => {
    if (!user?._id) return;

    navigate(`/profile/${user._id}`, {
      state: { user },
    });
  };

  const activeLabel =
    FILTERS.find(
      (item) => item.key === activeFilter
    )?.label || "All";

  return (
    <main className="discover-page">
      <div className="discover-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="discover-header discover-header-modern">
          <div className="discover-heading">

            <div className="discover-title-row">
              <h1>
                Discover
                <span className="discover-spark">
                  ✦
                </span>
              </h1>
            </div>

            <p>
              Find people who match your vibe
            </p>

          </div>

          <button
            type="button"
            className="discover-filter-modern"
            aria-label="Filters"
            onClick={() => setActiveFilter("all")}
          >
            <span className="filter-line filter-line-long"></span>
            <span className="filter-line filter-line-medium"></span>
            <span className="filter-line filter-line-short"></span>
          </button>
        </header>


        {/* =====================================
            SEARCH
        ====================================== */}

        <div className="discover-search discover-search-modern">

          <span
            className="discover-search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search username..."
            aria-label="Search username"
          />

          {search && (
            <button
              type="button"
              className="discover-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>


        {/* =====================================
            CATEGORY FILTERS
        ====================================== */}

        <div
          className="discover-category-tabs"
          role="tablist"
        >
          {FILTERS.map((filter) => {

            const selected =
              activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`discover-category-tab ${
                  selected ? "active" : ""
                } ${filter.key}`}
                onClick={() =>
                  handleFilter(filter.key)
                }
              >
                <span className="discover-category-icon">
                  {filter.icon}
                </span>

                <span>
                  {filter.label}
                </span>
              </button>
            );
          })}
        </div>


        {/* =====================================
            RESULTS HEADER
        ====================================== */}

        <div className="discover-results-row">

          <span className="discover-results-label">
            {activeLabel} matches
          </span>

          <button
            type="button"
            className="discover-refresh"
            onClick={() =>
              loadUsers(search, activeFilter)
            }
            disabled={loading}
            aria-label="Refresh discover"
          >
            ↻
          </button>

        </div>


        {/* =====================================
            USER LIST
        ====================================== */}

        <section className="discover-list discover-grid">

          {/* LOADING */}

          {loading && (
            <div className="discover-status-modern">

              <div className="discover-loader"></div>

              <h2>
                Finding your matches
              </h2>

              <p>
                Looking for people in your vibe.
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading && error && (
            <div className="discover-status-modern">

              <div className="discover-status-icon">
                !
              </div>

              <h2>
                Unable to load matches
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="discover-retry-button"
                onClick={() =>
                  loadUsers(search, activeFilter)
                }
              >
                Try Again
              </button>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            users.length === 0 && (
              <div className="discover-status-modern">

                <div className="discover-status-icon">
                  ✦
                </div>

                <h2>
                  {search.trim()
                    ? "No users found"
                    : `No ${activeLabel.toLowerCase()} matches yet`}
                </h2>

                <p>
                  {search.trim()
                    ? `Nothing matched "${search}".`
                    : "Try another category or come back later."}
                </p>

              </div>
            )}


          {/* USERS */}

          {!loading &&
            !error &&
            users.map((user, index) => {

              const category =
                user.category?.toLowerCase() ===
                "casual"
                  ? "casual"
                  : "loyal";

              const online =
                Boolean(user.isOnline);

              return (
                <article
                  className={`discover-card-modern ${category}`}
                  key={user._id}
                  onClick={() =>
                    handleProfile(user)
                  }
                  style={{
                    "--discover-delay": `${index * 55}ms`,
                  }}
                >

                  {/* PHOTO */}

                  <div className="discover-card-photo-wrap">

                    <div className="discover-card-photo">

                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={
                            user.username ||
                            "User"
                          }
                          loading="lazy"
                        />
                      ) : (
                        <div className="discover-photo-fallback">
                          {user.username
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "?"}
                        </div>
                      )}

                    </div>


                    {/* ONLINE STATUS */}

                    <div
                      className={`discover-status-pill ${
                        online
                          ? "online"
                          : "offline"
                      }`}
                    >
                      <span className="discover-status-dot"></span>

                      {online
                        ? "Online"
                        : "Available"}
                    </div>

                  </div>


                  {/* USER DETAILS */}

                  <div className="discover-card-content">

                    <div className="discover-name-row">

                      <div className="discover-user-details">

                        <h3>
                          {user.username}
                        </h3>

                        <p>
                          {user.age
                            ? `${user.age} • `
                            : ""}
                          {user.gender ||
                            "User"}
                        </p>

                      </div>


                      {/* CATEGORY */}

                      <span
                        className={`discover-category-badge ${category}`}
                      >
                        {category === "loyal"
                          ? "Loyal"
                          : "Casual"}
                      </span>

                    </div>

                  </div>

                </article>
              );
            })}

        </section>


        {/* =====================================
            BOTTOM NAVIGATION
        ====================================== */}

        <nav className="discover-bottom-nav discover-bottom-nav-modern">

          <button
            type="button"
            className="discover-nav active"
            onClick={() =>
              navigate("/discover")
            }
          >
            <span className="discover-nav-icon">
              ⌕
            </span>
            <span>
              Discover
            </span>
          </button>


          <button
            type="button"
            className="discover-nav"
            onClick={() =>
              navigate("/requests")
            }
          >
            <span className="discover-nav-icon">
              ♧
            </span>
            <span>
              Requests
            </span>
          </button>


          <button
            type="button"
            className="discover-nav"
            onClick={() =>
              navigate("/chat")
            }
          >
            <span className="discover-nav-icon">
              ◌
            </span>
            <span>
              Chat
            </span>
          </button>


          <button
            type="button"
            className="discover-nav"
            onClick={() =>
              navigate("/profile")
            }
          >
            <span className="discover-nav-icon">
              ♙
            </span>
            <span>
              Profile
            </span>
          </button>

        </nav>

      </div>
    </main>
  );
};

export default Discover;

