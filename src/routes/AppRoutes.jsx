
import { Routes, Route } from "react-router-dom";

// ==========================================
// AUTH / ONBOARDING
// ==========================================

import Splash from "../pages/Splash/Splash";
import Auth from "../pages/Auth/Auth";
import AuthCallback from "../pages/AuthCallback/AuthCallback";
import CreateProfile from "../pages/CreateProfile/CreateProfile";
import InterestCategory from "../pages/InterestCategory/InterestCategory";

import AboutYou from "../pages/AboutYou/AboutYou";
import AboutYouStep1 from "../pages/AboutYou/AboutYouStep1";
import AboutYouStep2 from "../pages/AboutYou/AboutYouStep2";

// ==========================================
// DISCOVER / PROFILE
// ==========================================

import Discover from "../pages/Discover/Discover";
import Profile from "../pages/Profile/Profile";

// ==========================================
// REQUEST / CONNECTION
// ==========================================

import RequestSent from "../pages/RequestSent/RequestSent";
import Requests from "../pages/Requests/Requests";
import Connected from "../pages/Connected/Connected";

// ==========================================
// CHAT / SAFETY
// ==========================================

import Chat from "../pages/Chat/Chat";
import SafetyPrompt from "../pages/SafetyPrompt/SafetyPrompt";
import EndConnection from "../pages/EndConnection/EndConnection";

// ==========================================
// APP ROUTES
// ==========================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          SPLASH / WELCOME
      ========================= */}

      <Route
        path="/"
        element={<Splash />}
      />


      {/* =========================
          AUTH
      ========================= */}

      <Route
        path="/auth"
        element={<Auth />}
      />


      {/* =========================
          GOOGLE AUTH CALLBACK
      ========================= */}

      <Route
        path="/auth-callback"
        element={<AuthCallback />}
      />


      {/* =========================
          CREATE PROFILE
      ========================= */}

      <Route
        path="/create-profile"
        element={<CreateProfile />}
      />


      {/* =========================
          INTEREST CATEGORY
      ========================= */}

      <Route
        path="/interest-category"
        element={<InterestCategory />}
      />


      {/* =========================
          ABOUT YOU
      ========================= */}

      <Route
        path="/about-you"
        element={<AboutYou />}
      />

      <Route
        path="/about-you-step-1"
        element={<AboutYouStep1 />}
      />

      <Route
        path="/about-you-step-2"
        element={<AboutYouStep2 />}
      />


      {/* =========================
          DISCOVER
      ========================= */}

      <Route
        path="/discover"
        element={<Discover />}
      />


      {/* =========================
          MY PROFILE
      ========================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* =========================
          OTHER USER PROFILE
      ========================= */}

      <Route
        path="/profile/:id"
        element={<Profile />}
      />


      {/* =========================
          REQUEST SENT
      ========================= */}

      <Route
        path="/request-sent"
        element={<RequestSent />}
      />


      {/* =========================
          REQUESTS
      ========================= */}

      <Route
        path="/requests"
        element={<Requests />}
      />


      {/* =========================
          CONNECTED USERS
      ========================= */}

      <Route
        path="/connected"
        element={<Connected />}
      />


      {/* =========================
          CHAT
      ========================= */}

      <Route
        path="/chat"
        element={<Chat />}
      />


      {/* =========================
          SAFETY PROMPT
      ========================= */}

      <Route
        path="/safety-prompt"
        element={<SafetyPrompt />}
      />


      {/* =========================
          END CONNECTION
      ========================= */}

      <Route
        path="/end-connection"
        element={<EndConnection />}
      />

    </Routes>
  );
};

export default AppRoutes;

