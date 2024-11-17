import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "./HomePage.css";

const HomePage = () => {
  const [gasVolume, setGasVolume] = useState("");
  const [valvePercent, setValvePercent] = useState("");
  const [setpoint, setSetpoint] = useState("");
  const [logs, setLogs] = useState([]); // For the subset of displayed logs
  const [fullLogs, setFullLogs] = useState([]); // For the entire parsed CSV data


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
      { timestamp, gasVolume, setpoint, valvePercent },
    ]);
    setGasVolume("");
    setSetpoint("");
    setValvePercent("");
  };

  const handleDeleteEntry = (index) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
  };

  const handleShowFreezes = () => {
    navigate("/loading", { state: { redirectTo: "/prediction", fullLogs } });
  };

  const handleDeleteAllEntries = () => {
    if (window.confirm("Are you sure? All data will be lost.")) {
      setLogs([]);
    }
  };

  // Handle CSV file import
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const fullData = result.data.slice(1); // Skip the header row
          setFullLogs(
            fullData.map((row) => ({
              timestamp: row[0],
              gasVolume: row[1] || "",
              setpoint: row[2] || "",
              valvePercent: row[3] || "",
            }))
          ); // Store the full data
  
          // Store the first ten rows for display
          const displayedLogs = fullData.slice(0, 10).map((row) => ({
            timestamp: row[0],
            gasVolume: row[1] || "",
            setpoint: row[2] || "",
            valvePercent: row[3] || "",
          }));
          setLogs(displayedLogs);
        },
        skipEmptyLines: true,
        dynamicTyping: true,
      });
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
          placeholder="Gas Setpoint (m³)"
          value={setpoint}
          onChange={(e) => setSetpoint(e.target.value)}
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

      {/* Import CSV button */}
      <div className="import-csv-container">
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          style={{ marginTop: "20px" }}
        />
      </div>

      <h2>Logged Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Gas Volume (m³)</th>
              <th>Set Point (m³)</th>
              <th>Valve Percent (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.gasVolume}</td>
                <td>{log.setpoint}</td>
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
