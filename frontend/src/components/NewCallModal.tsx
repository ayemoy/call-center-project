import React, { useEffect, useState } from "react";
import { fetchCalls, createCall } from "../services/callsService";
import "../css/NewCallModal.css";


interface Props {
  onClose: () => void;
  onCreate: (newCall: any) => void;
}

const NewCallModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [newCallName, setNewCallName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    try {
      const trimmedName = newCallName.trim();
      if (!trimmedName) {
        setErrorMsg("Name is required");
        return;
      }
      const res = await createCall(trimmedName);
      onCreate(res); // מחזיר את השיחה החדשה להורה
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to create call");
    }
  };

  return (
    <div className="modal-overlay inner-modal">
      <div className="modal-content">
        <h3>Create New Call</h3>
        <input
          type="text"
          value={newCallName}
          onChange={(e) => setNewCallName(e.target.value)}
          placeholder="Enter call name"
        />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCallModal;
