import React from "react";

const GoogleButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      className="google-button light"
      onClick={onClick}
    >
      <span className="google-icon">G</span>
      <span>{children}</span>
    </button>
  );
};

export default GoogleButton;