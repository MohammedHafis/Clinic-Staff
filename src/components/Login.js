import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles.css";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "staff@clinic.com" && password === "123456") {
      localStorage.setItem("authenticated", "true");
      setIsAuthenticated(true);
      navigate("/calendar");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container card">
      <h2>Clinic Staff Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
