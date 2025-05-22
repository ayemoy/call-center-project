import React, { useEffect, useState } from "react";
import "../css/SuggestedTaskModal.css";
import { fetchTags } from "../services/tagsService";
import { createSuggestedTask, fetchAllSuggestedTasks, deleteSuggestedTaskById, updateSuggestedTaskName } from "../services/suggestedTasksService";
import socket from "../socket";
interface Props {
  onClose: () => void;
}

const SuggestedTaskModal: React.FC<Props> = ({ onClose }) => {
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");


  const [allTasks, setAllTasks] = useState<{ id: string; name: string }[]>([]); 
  const [showManagePanel, setShowManagePanel] = useState(false); 


  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error("Failed to fetch tags");
      }
    };
    loadTags();
  }, []);



  useEffect(() => {
    const loadAllTasks = async () => {
      try {
        const tasks = await fetchAllSuggestedTasks();
        setAllTasks(tasks);
      } catch (err) {
        console.error("Failed to load suggested tasks");
      }
    };

    socket.on("suggestedTasksUpdated", (tasks: any) => {
      setAllTasks(tasks);
    });

    if (showManagePanel) {
      loadAllTasks();
    }

    return () => {
      socket.off("suggestedTasksUpdated");
    };
  }, [showManagePanel]);



  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    
    if (!taskId || !taskName) {
      setError("Task ID and name are required");
      return;
    }
    try {
      await createSuggestedTask(taskId, {
        name: taskName,
        tags: selectedTags.map(tag => tag.toLowerCase()),
      });
      onClose();
    } catch (err) {
      console.error("Error creating suggested task", err);
      setError("Task ID already exists or failed to save");
    }
  };

  const filteredTags = availableTags.filter(tag => !selectedTags.includes(tag));

  const handleRemoveTag = (tagToRemove: string) => {
  setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
};


  return (
    <div className="modal-overlay-suggested-task">
      <div className="modal-suggested-task">
        <h2 className="modal-title-suggested-task">New Suggested Task</h2>

        <input
          type="text"
          placeholder="Enter Task ID"
          value={taskId}
          onChange={e => setTaskId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Task Name"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
        />

        <div className="dropdown-container-suggested-task">
          <label className="section-label-suggested-task">Tags</label>
          <button
            className="add-tag-btn-suggested-task"
            style={{ backgroundColor: "#2196f3" }}
            onClick={() => setShowManagePanel(!showManagePanel)}
          >
            {showManagePanel ? "Hide Task Manager" : "Manage Suggested Tasks"}
          </button>
          <button className="add-tag-btn-suggested-task" onClick={() => setShowDropdown(!showDropdown)}>Add Tag</button>
          
          {showDropdown && (
            <div className="dropdown-suggested-task">
              {filteredTags.map(tag => (
                <div
                  key={tag}
                  className="dropdown-item-suggested-task"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tags-container-tasks-suggested-task">
          <strong>Selected Tags:</strong>
          <div className="tag-list-suggested-task">
            {selectedTags.map(tag => (
              <span key={tag} className="tag-chip-suggested-task">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                <button
                  className="remove-tag-btn"
                  onClick={() => handleRemoveTag(tag)}
                  title="Remove tag"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>


        {showManagePanel && (
          <div className="task-manager">
            <h4>Manage Suggested Tasks</h4>
            {allTasks.map(task => (
              <div key={task.id} className="task-item">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) =>
                    setAllTasks(prev =>
                      prev.map(t =>
                        t.id === task.id ? { ...t, name: e.target.value } : t
                      )
                    )
                  }
                />
                <button onClick={() => updateSuggestedTaskName(task.id, task.name)}>
                  Save
                </button>
                <button onClick={() => deleteSuggestedTaskById(task.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <div className="button-row-suggested-task">
          <button className="save-btn-suggested-task" onClick={handleSubmit}>Save Task</button>
          <button className="close-btn-sug-task" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedTaskModal;
