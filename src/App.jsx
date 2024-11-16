import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import PredictionPage from "./components/PredictionPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction" element={<PredictionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
