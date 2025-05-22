import React, { useState } from "react";
import "../css/NewTaskModal.css";
import { createTask } from "../services/callsService";

interface Props {
  callId: string;
  existingTasks: { name: string }[]; 
  onClose: () => void;
}

const NewTaskModal: React.FC<Props> = ({ callId, existingTasks, onClose}) => {
  const [taskName, setTaskName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = async () => {
    const name = taskName.trim();
    if ( !name) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (existingTasks.find(t => t.name.toLowerCase() === name.toLowerCase())) {
      setErrorMsg("Task with this name already exists in this call");
      return;
    }

    try {
      await createTask(callId, { name });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <div className="modal-overlay inner-modal">
      <div className="modal-content-new-task">
        <h3>New Task</h3>
      
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <div className="modal-buttons-new-task">
          <button className="submit-btn-new-task" onClick={handleAdd}>Add</button>
          <button className="cancel-btn-new-task" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
