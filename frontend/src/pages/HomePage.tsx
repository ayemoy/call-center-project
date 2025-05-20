import React, { useEffect, useState } from "react";
import "../css/HomePage.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TagsManagement from "../components/TagsManagement";
import CallsManagement  from "../components/CallsManagement";
import NavBar from "../components/NavBar"; // 

const HomePage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();


  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showCallsModal, setShowCallsModal] = useState(false);


  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="homepage-container">Loading...</div>;
  }

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>📞 Tel Aviv Municipality Call Center</h1>
        <p>Internal system for managing emergency calls and tasks</p>
        <h3>Welcome, {user?.displayName || user?.email}</h3>
      </header>

      <main className="homepage-main">
        <section className="homepage-card">
          <h2>Open Calls</h2>
          <p>View and manage real-time incoming calls</p>
          <button onClick={() => setShowCallsModal(true)}>Manage Calls</button>
        </section>

        {user?.role === "admin" && (
          <>
            <section className="homepage-card">
              <h2>Tag Management</h2>
              <p>Create and edit tags related to call topics</p>
              <button onClick={() => setShowTagsModal(true)}>Go to Admin Area</button>
            </section>

            <section className="homepage-card">
              <h2>Suggested Tasks</h2>
              <p>Define quick actions based on call tags</p>
              <button onClick={() => navigate("/admin/tasks")}>View Tasks</button>
            </section>
          </>
        )}
      </main>

      {showTagsModal && <TagsManagement onClose={() => setShowTagsModal(false)} />}
      {showCallsModal && <CallsManagement onClose={() => setShowCallsModal(false)} />}

    </div>
  );
};


export default HomePage;
