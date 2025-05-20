import React, { useEffect, useState } from "react";
import { fetchCalls } from "../services/callsService";
import "../css/CallsManagement.css";

interface Props {
  onClose: () => void;
}

type CallStatus = "New" | "In Progress" | "Completed";

interface Task {
  id: string;
  name: string;
  status: CallStatus;
}

interface Call {
  id: string;
  name: string;
  status: CallStatus;
  tags: string[];
  tasks: Task[];
}

const CallsManagement: React.FC<Props> = ({ onClose }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const data = await fetchCalls();
        setCalls(data);
      } catch (error) {
        console.error("Failed to load calls", error);
      }
    };
    loadCalls();
  }, []);

  const getTaskColor = (status: CallStatus) => {
    switch (status) {
      case "Completed": return "task-green";
      case "In Progress": return "task-orange";
      case "New": return "task-blue";
      default: return "";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal calls-modal">
        <div className="calls-left">
          <div className="calls-header">
            <h3>Calls</h3>
            <button className="new-call-btn">New</button>
          </div>
          <div className="call-list">
            {calls.map((call) => (
              <button
                key={call.id}
                className="call-btn"
                onClick={() => setSelectedCall(call)}
              >
                {call.name}
              </button>
            ))}
          </div>
        </div>

        <div className="calls-right">
          {selectedCall ? (
            <>
              <h3>{selectedCall.name}</h3>

              <div className="section">
                <label>Tags:</label>
                <div className="tags-list">
                  {selectedCall.tags.map((tag) => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                  <button className="icon-btn">+</button>
                </div>
              </div>

              <div className="section">
                <div className="tasks-header">
                  <label>Tasks:</label>
                  <button className="new-task-btn">New</button>
                </div>
                <div className="tasks-list">
                  {selectedCall.tasks.map((task) => (
                    <div key={task.id} className={`task-card ${getTaskColor(task.status)}`}>
                      <span className="task-name">{task.name}</span>
                      <select className="task-status" defaultValue={task.status}>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p>Select a call to view details</p>
          )}
        </div>

        <div className="calls-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CallsManagement;
