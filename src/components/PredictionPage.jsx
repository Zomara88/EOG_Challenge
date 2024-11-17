import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./PredictionPage.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PredictionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logs = location.state?.fullLogs || [];

  const [hydratePeriods, setHydratePeriods] = useState([]);

  useEffect(() => {
    const fetchHydratePrediction = async () => {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logs),
      });

      if (response.ok) {
        const data = await response.json();
        setHydratePeriods(data.hydrate_periods);  
      } else {
        console.error("Failed to fetch hydrate prediction");
      }
    };

    fetchHydratePrediction();
  }, [logs]);

  const chartData = {
    labels: logs.map((log) => log.timestamp),  // X-axis: timestamps
    datasets: [
      {
        label: "Gas Volume (m³)",
        data: logs.map((log) => log.gasVolume),  // Y-axis: gas volumes
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
      },
      {
        label: "Hydrate Prediction",
        data: logs.map((log) => (log.hydrate ? log.gasVolume : null)),  // Mark hydrate predictions
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        pointRadius: 5,
        fill: false,
      },
    ],
  };

  const handleBackToHome = () => {
    navigate("/loading", { state: { redirectTo: "/", logs } });
  };

  return (
    <div className="predictionpage-container">
      <div className="header-container">
        <h1 className="header-title">Summary</h1>
        <button className="back-home-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
      <h2>Logged Data with Hydrate Prediction</h2>
      <div className="chart-container">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
      {/* <h2>Detailed Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Gas Volume (m³)</th>
              <th>Set Point (m³)</th>
              <th>Valve Percent (%)</th>
              <th>Hydrate Prediction</th>
            </tr>
          </thead>
          <tbody>
            {hydratePeriods.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.gasVolume}</td>
                <td>{log.setpoint}</td>
                <td>{log.valvePercent}</td>
                <td>{log.hydrate ? "Possible Hydrate" : "No Hydrate"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default PredictionPage;
