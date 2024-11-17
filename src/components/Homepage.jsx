import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [gasVolume, setGasVolume] = useState("");
  const [valvePercent, setValvePercent] = useState("");
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem("logs");
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const handleAddEntry = () => {
    if (!gasVolume || !valvePercent) {
      alert("Both fields are required.");
      return;
    }
    if (parseFloat(valvePercent) > 100) {
      alert("Valve Percent cannot exceed 100.");
      return;
    }
    const timestamp = new Date().toLocaleString(); // Current device clock
    setLogs([
      ...logs,
      { gasVolume, valvePercent, timestamp },
    ]);
    setGasVolume("");
    setValvePercent("");
  };

  const handleDeleteEntry = (index) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
  };

  const handleShowFreezes = () => {
    navigate("/loading", { state: { redirectTo: "/prediction", logs } });
  };  

  const handleDeleteAllEntries = () => {
    if (window.confirm("Are you sure? All data will be lost.")) {
      setLogs([]);
    }
  };

  return (
    <div className="homepage-container">
      <h1>Prevent Hydrate</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Gas Volume (m³)"
          value={gasVolume}
          onChange={(e) => setGasVolume(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valve Percent (%)"
          value={valvePercent}
          onChange={(e) => setValvePercent(e.target.value)}
        />
        <button className="water-droplet-button" onClick={handleAddEntry}>
          Enter
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.gasVolume}</td>
                <td>{log.valvePercent}</td>
                <td>
                  <button onClick={() => handleDeleteEntry(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          <button className="delete-entries-button" onClick={handleDeleteAllEntries}>
            Delete Entries
          </button>
          <button className="show-freezes-button" onClick={handleShowFreezes}>
            Show Freezes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
