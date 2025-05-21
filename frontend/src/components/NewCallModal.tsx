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
      onCreate(res); 
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to create call");
    }
  };

  return (
    <div className="modal-overlay inner-modal-new-call">
      <div className="modal-content-new-call">
        <h3>Create New Call</h3>
        <input
          type="text"
          value={newCallName}
          onChange={(e) => setNewCallName(e.target.value)}
          placeholder="Enter call name"
        />
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <div className="modal-buttons-new-call">
          <button className="submit-btn-new-call" onClick={handleSubmit}>
            Submit
          </button>
          <button className="cancel-btn-new-call" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCallModal;
