import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Calendar from "./components/Calendar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/calendar" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? (
              <Calendar setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
