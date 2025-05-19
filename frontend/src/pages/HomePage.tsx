    import React from "react";
    import "../css/HomePage.css";

    const HomePage = () => {
    return (
        <div className="homepage-container">
        <header className="homepage-header">
            <h1>📞 Tel Aviv Municipality Call Center</h1>
            <p>Internal system for managing emergency calls and tasks</p>
        </header>

        <main className="homepage-main">
            {/* Card: Active Calls */}
            <section className="homepage-card">
            <h2>Open Calls</h2>
            <p>View and manage real-time incoming calls</p>
            <button>Manage Calls</button>
            </section>

            {/* Card: Tag Management */}
            <section className="homepage-card">
            <h2>Tag Management</h2>
            <p>Create and edit tags related to call topics</p>
            <button>Go to Admin Area</button>
            </section>

            {/* Card: Suggested Tasks */}
            <section className="homepage-card">
            <h2>Suggested Tasks</h2>
            <p>Define quick actions based on call tags</p>
            <button>View Tasks</button>
            </section>
        </main>
        </div>
    );
    };

    export default HomePage;
