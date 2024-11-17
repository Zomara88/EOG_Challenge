import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "./TableComponent";

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
      { gasVolume, valvePercent, timestamp }
    ]);
    setGasVolume("");
    setValvePercent("");
  };

  const handleDeleteEntry = (index) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
  };

  const handleContinue = () => {
    // Pass logs to next page or save to state management
    navigate("/prediction", { state: { logs } });
  };

  return (
    <div>
      <h1>Home Page</h1>
      <input
        type="text"
        placeholder="Gas Volume"
        value={gasVolume}
        onChange={(e) => setGasVolume(e.target.value)}
      />
      <input
        type="text"
        placeholder="Valve Percent"
        value={valvePercent}
        onChange={(e) => setValvePercent(e.target.value)}
      />
      <button onClick={handleAddEntry}>Add Entry</button>
      <button onClick={handleContinue}>Continue</button>
      <h2>Logged Data</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {`Gas Volume: ${log.gasVolume}, Valve Percent: ${log.valvePercent}, Timestamp: ${log.timestamp}`}
            <button onClick={() => handleDeleteEntry(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;