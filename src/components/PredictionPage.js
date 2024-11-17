import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PredictionPage.css";

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
    <div className="predictionpage-container">
      <div className="header-container">
        <h1 className="header-title">Prediction Page</h1>
        <button className="back-home-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
      <h2>Logged Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Gas Volume (m³)</th>
              <th>Valve Percent (%)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.gasVolume}</td>
                <td>{log.valvePercent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button className="get-prediction-button" onClick={handleGetPrediction}>
          Get Prediction
        </button>
      </div>
    </div>
  );
};

export default PredictionPage;