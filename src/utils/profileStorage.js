import { authFetch } from "../services/api";
const API_URL = "https://ghostinbox09.onrender.com/api";

// ==========================================
// GET MY PROFILE
// ==========================================

export const getProfile = async () => {
  try {
    const response = await authFetch(
      `${API_URL}/profile/me`,
      {
        method: "GET",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load profile"
      );
    }

    return data.user || {};

  } catch (error) {

    console.error(
      "Profile error:",
      error
    );

    return {};
  }
};


// ==========================================
// SAVE PROFILE
// ==========================================

export const saveProfile = (data) => {
  return data;
};