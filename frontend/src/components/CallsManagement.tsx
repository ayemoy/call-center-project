import React, { useEffect, useState } from "react";
import { fetchCalls, updateCallTags , updateTaskStatus, createTask, deleteTask } from "../services/callsService";
import { fetchTags } from "../services/tagsService";
import "../css/CallsManagement.css";
import NewCallModal from "./NewCallModal";
import NewTaskModal from "./NewTaskModal";
import Select from "react-select";
import { getSuggestedTasksByTags } from "../services/suggestedTasksService";
import socket from "../socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPhone   } from "@fortawesome/free-solid-svg-icons";


interface Props {
  onClose: () => void;
}

type CallStatus = "New" | "In Progress" | "Completed";

interface Task {
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

  const [message, setMessage] = useState("");



//useeffect for socket io
  useEffect(() => {
  socket.on("callsUpdated", (updatedCalls: Call[]) => {
    setCalls(updatedCalls);
    if (selectedCall) {
      const updated = updatedCalls.find(c => c.id === selectedCall.id);
      if (updated) setSelectedCall(updated);
    }
  });

  return () => {
    socket.off("callsUpdated");
  };
}, [selectedCall]);


useEffect(() => {
  socket.on("suggestedTasksUpdated", (updatedTasks: { id: string; name: string }[]) => {
    setSuggestedTasks(updatedTasks);
  });

  return () => {
    socket.off("suggestedTasksUpdated");
  };
}, []);



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


const handleStatusChange = async (taskName: string, newStatus: CallStatus) => {
  if (!selectedCall) return;

  const task = selectedCall.tasks.find(t => t.name === taskName);
  if (!task) return;

  const confirmChange = window.confirm(
    `Are you sure you want to change the status of "${taskName}" from "${task.status}" to "${newStatus}"?`
  );

  if (!confirmChange) return;

  const updatedTasks = selectedCall.tasks.map(task =>
    task.name === taskName ? { ...task, status: newStatus } : task
  );

  const updatedCall = { ...selectedCall, tasks: updatedTasks };
  setSelectedCall(updatedCall);
  setCalls(calls.map(c => c.id === updatedCall.id ? updatedCall : c));

  await updateTaskStatus(selectedCall.id, taskName, newStatus);
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



const handleCreateNewTask = async (task: { name?: string }) => {
  if (!selectedCall || !task.name) return;

  const newName = task.name.trim().toLowerCase();

  const alreadyExistsInCall = selectedCall.tasks.some(
    t => t.name.trim().toLowerCase() === newName
  );

  if (alreadyExistsInCall) {
    setMessage("Task with this name already exists in this call.");
    return;
  }

  try {
    await createTask(selectedCall.id, { name: task.name });
    setMessage(""); 
  } catch (err) {
    console.error("Failed to create task", err);
    setMessage("Failed to create task");
  }
};



const handleDeleteTask = async (taskName: string) => {
  if (!selectedCall) return;

  const confirmDelete = window.confirm(`Are you sure you want to delete the task "${taskName}"?`);
  if (!confirmDelete) return;

  try {
    await deleteTask(selectedCall.id, taskName);
    setMessage(""); 
  } catch (err) {
    console.error("Failed to delete task", err);
    setMessage("Failed to delete task.");
  }
};


const handleDeleteTag = async (tagToDelete: string) => {
  if (!selectedCall) return;

  const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tagToDelete}"?`);
  if (!confirmDelete) return;


  const updatedTags = selectedCall.tags.filter(tag => tag !== tagToDelete);

  try {
    await updateCallTags(selectedCall.id, updatedTags);

    const updatedCall = { ...selectedCall, tags: updatedTags };
    setSelectedCall(updatedCall);
    setCalls(calls.map(c => c.id === selectedCall.id ? updatedCall : c));

    const tasks = await getSuggestedTasksByTags(updatedTags);
    setSuggestedTasks(tasks);

    setMessage("");
  } catch (err) {
    console.error("Failed to delete tag", err);
    setMessage("Failed to delete tag.");
  }
};





  return (
  <div className="modal-overlay">
    <div className="modal calls-modal">
      <div className="calls-left">
        <div className="calls-header">
          <h3>Calls</h3>
          <button className="new-call-btn" onClick={() => setShowNewCallModal(true)}>
            Add New Call
          </button>
        </div>
        <div className="call-list">
          {calls.map((call) => (
            <button
              key={call.id}
              className={`call-btn ${selectedCall?.id === call.id ? 'selected' : ''}`}
              onClick={() => setSelectedCall(call)}
            >
              <FontAwesomeIcon icon={faPhone} className="call-icon" />
              <span className="call-name">{call.name}</span>
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
                  <div key={tag} className="tag-chip-with-delete">
                    <span className="tag-chip">{tag}</span>
                    <button className="tag-delete-btn" onClick={() => handleDeleteTag(tag)}>×</button>
                  </div>
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
                {message && <p className="error-msg">{message}</p>}
                <button
                  className="new-task-btn"
                  onClick={() => setShowNewTaskModal(true)}
                >
                  Add New Task
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

                      const alreadyExists = selectedCall.tasks.some(
                        t => t.name.trim().toLowerCase() === option.label.trim().toLowerCase()
                      );

                      if (alreadyExists) {
                        setMessage("Task with this name already exists in this call.");
                        return;
                      }

                      const newTask = {
                        name: option.label,
                      };

                      handleCreateNewTask(newTask);
                    }}

                  />
                </div>

              )}


              <div className="tasks-list">
                  {selectedCall.tasks.map(task => (
                    <div key={task.name} className={`task-card ${getTaskColor(task.status)}`}>
                      <span className="task-name">{task.name}</span>
                      <select
                        className="task-status"
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.name, e.target.value as CallStatus) 
                        }
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <button
                        className="delete-task-btn"
                        onClick={() => handleDeleteTask(task.name)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
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
      />
    )}

    {/* New Task Modal */}
    {showNewTaskModal && selectedCall && (
      <NewTaskModal
        callId={selectedCall.id}
        existingTasks={selectedCall.tasks}
        onClose={handleCloseNewTaskModal}
      />
    )}
  </div>
);

};

export default CallsManagement;
