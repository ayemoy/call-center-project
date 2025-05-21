import React, { useEffect, useState } from "react";
import { fetchCalls, updateCallTags } from "../services/callsService";
import { fetchTags } from "../services/tagsService";
import "../css/CallsManagement.css";
import NewCallModal from "./NewCallModal";
import NewTaskModal from "./NewTaskModal";
import Select from "react-select";
import { getSuggestedTasksByTags } from "../services/suggestedTasksService";

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

  const [allTags, setAllTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [suggestedTasks, setSuggestedTasks] = useState<{ id: string, name: string }[]>([]);



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


  useEffect(() => {
  const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAllTags(tags);
      } catch (err) {
        console.error("Failed to load tags");
      }
    };
    loadTags();
  }, []);


  useEffect(() => {
  const fetchSuggestions = async () => {
    if (!selectedCall || selectedCall.tags.length === 0) {
      setSuggestedTasks([]);
      return;
    }

    try {
      const tasks = await getSuggestedTasksByTags(selectedCall.tags);
      setSuggestedTasks(tasks);
    } catch (err) {
      console.error("Failed to fetch suggested tasks");
    }
  };

  fetchSuggestions();
}, [selectedCall?.tags]);


  const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


  const getAvailableTags = () => {
  if (!selectedCall) return [];

  const selectedNormalized = selectedCall.tags.map(tag =>
    capitalize(tag.trim())
  );

  return allTags
    .map(tag => capitalize(tag.trim()))
    .filter(tag => !selectedNormalized.includes(tag));
};



  const handleTagSelect = async (selectedOption: any) => {
  if (!selectedCall) return;
  const newTag = capitalize(selectedOption.value.trim());

  try {
    await updateCallTags(selectedCall.id, [...selectedCall.tags, newTag]);

    const updatedCalls = calls.map(call =>
      call.id === selectedCall.id
        ? { ...call, tags: [...call.tags, newTag] }
        : call
    );

    setCalls(updatedCalls);
    setSelectedCall({
      ...selectedCall,
      tags: [...selectedCall.tags, newTag],
    });

    setShowTagDropdown(false);
  } catch (error) {
    console.error("Failed to add tag", error);
  }
};



  const getTaskColor = (status: CallStatus) => {
    switch (status) {
      case "Completed": return "task-green";
      case "In Progress": return "task-orange";
      case "New": return "task-blue";
      default: return "";
    }
  };

  const handleCloseNewTaskModal = () => {
    setShowNewTaskModal(false);
  };

  const handleCreateNewTask = (newTask: Task) => {
    if (!selectedCall) return;

    const updated = calls.map(call =>
      call.id === selectedCall.id
        ? { ...call, tasks: [...call.tasks, newTask] }
        : call
    );

    setCalls(updated);
    setSelectedCall({
      ...selectedCall,
      tasks: [...selectedCall.tasks, newTask],
    });
  };

  return (
  <div className="modal-overlay">
    <div className="modal calls-modal">
      <div className="calls-left">
        <div className="calls-header">
          <h3>Calls</h3>
          <button className="new-call-btn" onClick={() => setShowNewCallModal(true)}>
            New Call
          </button>
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
                <div className="dropdown-container">
                  <button className="icon-btn" onClick={() => setShowTagDropdown(!showTagDropdown)}>+</button>
                  
                  {showTagDropdown && (
                    <ul className="custom-dropdown">
                      {getAvailableTags().length === 0 ? (
                        <li className="no-options">No tags available</li>
                      ) : (
                        getAvailableTags().map((tag) => (
                          <li
                            key={tag}
                            className="dropdown-item"
                            onClick={() => handleTagSelect({ value: tag })}
                          >
                            {tag}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="tasks-header">
                <label>Tasks:</label>
                <button
                  className="new-task-btn"
                  onClick={() => setShowNewTaskModal(true)}
                >
                  New Task
                </button>
              </div>

              {suggestedTasks.length > 0 && (
                <div className="suggested-task-wrapper">
                  <Select
                    className="suggested-task-select"
                    classNamePrefix="react-select"
                    options={suggestedTasks.map(task => ({
                      value: task.id,
                      label: task.name
                    }))}
                    placeholder="Suggested Tasks"
                    onChange={(option) => {
                      if (!selectedCall || !option) return;

                      const alreadyExists = selectedCall.tasks.some(t => t.id === option.value);
                      if (alreadyExists) return;

                      const newTask = {
                        id: option.value,
                        name: option.label,
                        status: "New" as CallStatus,
                      };

                      handleCreateNewTask(newTask);
                    }}
                  />
                </div>
              )}


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

    {/* New Call Modal */}
    {showNewCallModal && (
      <NewCallModal
        onClose={() => setShowNewCallModal(false)}
        onCreate={(newCall) => setCalls([...calls, newCall])}
      />
    )}

    {/* New Task Modal */}
    {showNewTaskModal && selectedCall && (
      <NewTaskModal
        callId={selectedCall.id}
        existingTasks={selectedCall.tasks}
        onClose={handleCloseNewTaskModal}
        onCreate={handleCreateNewTask}
      />
    )}
  </div>
);

};

export default CallsManagement;
