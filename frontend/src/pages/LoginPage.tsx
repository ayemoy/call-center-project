import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/loginService";
import "../css/LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  // Redirect after successful login (or if already logged in)
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        navigate("/home");
      } else {
        navigate("/home");
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate via Firebase Auth + fetch Firestore data
      const loggedUser = await loginUser(email, password);
      // Store user in context (and in localStorage)
      login(loggedUser);
      // Navigation will happen automatically in the useEffect above
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  if (loading) {
    return <div className="login-container">Loading...</div>;
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
