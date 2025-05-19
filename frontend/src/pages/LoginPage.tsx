import React, { useState } from "react";
import { loginUser } from "../services/loginService";
import "../css/LoginPage.css";
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
        const user = await loginUser(email, password);
        console.log("Logged in user:", user);
        navigate('/home');
        // Navigate to home, store user, etc.
        } catch (err: any) {
        setError(err.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
            <label>Password</label>
            <input
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
