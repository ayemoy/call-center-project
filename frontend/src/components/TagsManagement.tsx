import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import "../css/TagsManagement.css";
import Select from "react-select";
import { fetchTags, createTag , deleteTag, renameTag} from "../services/tagsService";
import socket from ".././socket";

interface Props {
  onClose: () => void;
}

const TagsManagement: React.FC<Props> = ({ onClose }) => {
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);


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

    socket.on("tagCreated", ({ name }) => {
      setTags(prev => [...prev, name]);
    });

    socket.on("tagRenamed", ({ oldName, newName }) => {
      setTags(prev => prev.map(tag => tag === oldName ? newName : tag));
    });

    socket.on("tagDeleted", ({ name }) => {
      setTags(prev => prev.filter(tag => tag !== name));
    });

    return () => {
      socket.off("tagCreated");
      socket.off("tagRenamed");
      socket.off("tagDeleted");
    };
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



  const handleDelete = async (tag: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tag}"?`);
    if (!confirmDelete) return;
    try {
      await deleteTag(tag);
      setMessage("Tag deleted");
      loadTags();
    } catch (err: any) {
      console.error(err);
      setMessage("Error deleting tag");
    }
  };

  const handleEdit = async () => {
    if (!editingTag || !newName.trim()) return;

    const confirmRename = window.confirm(
    `Are you sure you want to rename "${editingTag}" to "${newName}"?`);
    if (!confirmRename) return;

    try {
      await renameTag(editingTag, newName.trim());
      setMessage("Tag updated");
      setEditingTag(null);
      setNewName("");
      loadTags();
    } catch (err) {
      console.error(err);
      setMessage("Error updating tag");
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
            <div key={tag} className="tag-wrapper">
              {editingTag === tag ? (
                <>
                  <input
                    className="edit-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New name"
                  />
                  <button className="save-btn" onClick={handleEdit}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditingTag(null)}>Cancel</button>
                </>
              ) : (
                <span className="tag-chip">
                  {tag}
                  <div className="dropdown-container">
                    <button
                      className="menu-btn"
                      onClick={() => setDropdownOpen(dropdownOpen === tag ? null : tag)}
                    >⋮</button>
                    {dropdownOpen === tag && (
                      <div className="dropdown-menu">
                        <div onClick={() => {
                          setEditingTag(tag);
                          setNewName(tag);
                          setDropdownOpen(null);
                        }}>
                          ✏️ Edit
                        </div>
                        <div onClick={() => {
                          handleDelete(tag);
                          setDropdownOpen(null);
                        }}>
                          🗑 Delete
                        </div>
                      </div>
                    )}
                  </div>
                </span>
              )}
            </div>
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
