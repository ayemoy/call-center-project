import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import "../css/TagsManagement.css";
import Select from "react-select";


interface Props {
  onClose: () => void;
}

const TagsManagement: React.FC<Props> = ({ onClose }) => {
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const fetchTags = async () => {
    const snapshot = await getDocs(collection(db, "tags"));
    const result = snapshot.docs.map(doc => doc.data().name);
    setTags(result);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async () => {
    const cleanName = tagName.trim().toLowerCase();
    if (!cleanName) return;

    if (tags.map(t => t.toLowerCase()).includes(cleanName)) {
      setMessage("Tag already exists.");
      return;
    }

    try {
      await setDoc(doc(db, "tags", cleanName), { name: tagName.trim() });
      setMessage("Tag created!");
      setTagName("");
      fetchTags(); // reload tags
    } catch (err) {
      console.error(err);
      setMessage("Error creating tag.");
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

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TagsManagement;
