import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import PredictionPage from "./components/PredictionPage";
import Loading from "./components/Loading";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/prediction" element={<PredictionPage />} />
      </Routes>
    </Router>
  );
}

export default App;

