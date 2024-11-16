import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PredictionPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const logs = state?.logs || [];

  const handleGetPrediction = () => {
    // Replace this with actual ML model call or API request
    console.log("Predicting based on logs:", logs);
    alert("Prediction: Hydrate likely in X minutes!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prediction Page</h1>
      <button onClick={handleGetPrediction}>Get Prediction</button>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Logged Data</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {log.timestamp}: {log.gasVolume} gas, {log.valvePercent}% valve
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictionPage;
