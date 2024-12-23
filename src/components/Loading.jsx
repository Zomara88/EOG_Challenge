import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Loading.css";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/"; // Defaults to home if not specified
  const logs = location.state?.fullLogs || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { state: { fullLogs: logs } });
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, [navigate, redirectTo, logs]);

  return (
    <div className="loading-container">
      <div className="spinner">
        <img src="./loading.GIF" alt="Loading..." className="loading-gif" />
        <p className="loading-text">Loading<span className="dots"></span></p>
      </div>
    </div>
  );
};

export default Loading;
