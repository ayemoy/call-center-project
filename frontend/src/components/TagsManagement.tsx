import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import "../css/TagsManagement.css";
import Select from "react-select";
import { fetchTags, createTag } from "../services/tagsService";

interface Props {
  onClose: () => void;
}

const TagsManagement: React.FC<Props> = ({ onClose }) => {
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const loadTags = async () => {
    try {
      const result = await fetchTags();
      setTags(result);
    } catch (err) {
      console.error("Failed to fetch tags", err);
      setMessage("Failed to load tags");
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async () => {
    const cleanName = tagName.trim().toLowerCase();
    if (!cleanName) return;

    if (tags.map(t => t.toLowerCase()).includes(cleanName)) {
      setMessage("Tag already exists.");
      return;
    }

    try {
      const response = await createTag(tagName.trim());
      setMessage(response.message);
      setTagName("");
      loadTags();
    } catch (err: any) {
      console.error(err);
      setMessage("Error creating tag");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Tag Management</h2>

        <div className="input-row">
          <input
            type="text"
            placeholder="Enter new tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <h3 className="existing-title">Existing Tags:</h3>
        <div className="tags-container">
          {tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
              {/* <button className="remove-btn" onClick={() => handleDelete(tag)}>
                ×
              </button> */}
              
            </span>
          ))}
        </div>

        <button className="close-btn-tags" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TagsManagement;
