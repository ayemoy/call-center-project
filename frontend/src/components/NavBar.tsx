import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Adjust path as needed
import { useAuth } from "../context/AuthContext"; // useAuth instead of useContext
import "../css/NavBar.css";
import logo from "../pictures/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"; 



const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading , logout } = useAuth(); // Destructure from useAuth
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

  // Optional: show nothing while loading
    if (loading) return null;

    return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          alt="Logo"
          className="navbar-logo-img"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        <span className="navbar-title">Tel Aviv Call Center</span>
      </div>

      {user && (
        <div className="navbar-user-section">
          <div
            className="navbar-welcome"
            onClick={() => setMenuOpen(!isMenuOpen)}
            >
             {user.displayName || user.email?.split("@")[0]}
            <FontAwesomeIcon
                icon={faChevronDown}
                className={`navbar-chevron ${isMenuOpen ? "rotate" : ""}`}
            />
            </div>

          {isMenuOpen && (
            <div className="navbar-menu">
              <div onClick={handleLogout} className="navbar-menu-item">
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
