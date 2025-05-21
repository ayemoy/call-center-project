import React, { useEffect, useState } from "react";
import "../css/SuggestedTaskModal.css";
import { fetchTags } from "../services/tagsService";
import { createSuggestedTask } from "../services/suggestedTasksService";

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
          <label className="section-label-suggested-task">Tags:</label>
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
          <strong>Existing Tags:</strong>
          <div className="tag-list-suggested-task">
            {selectedTags.map(tag => (
              <span key={tag} className="tag-chip-suggested-task">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>
        </div>

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
