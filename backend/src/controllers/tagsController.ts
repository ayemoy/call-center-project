import { Request, Response, RequestHandler } from 'express';
import { getAllTags, addTagIfNotExists, renameTagEverywhere, deleteTagEverywhere   } from '../tags/tags';
import { io } from '../index';




export const getTagsController: RequestHandler = async (req, res) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({ tags });
  } catch (err) {
    console.error("🔥 getTagsController error:", err); 
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};



export const createTagController: RequestHandler = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ message: "Invalid tag name" });
    return;
  }

  try {
    const result = await addTagIfNotExists(name);
    io.emit("tagCreated", { name }); 
    res.status(200).json({ message: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to create tag" });
  }
};




export const renameTagController: RequestHandler = async (req, res) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName) return res.status(400).json({ message: "Missing fields" });

  try {
    await renameTagEverywhere(oldName, newName);
    io.emit("tagRenamed", { oldName, newName }); 
    res.status(200).json({ message: "Tag renamed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to rename tag in controller" });
  }
};




export const deleteTagController: RequestHandler = async (req, res) => {
  const name = req.params.name;
  if (!name) return res.status(400).json({ message: "Tag name required" });

  try {
    await deleteTagEverywhere(name);
    io.emit("tagDeleted", { name }); 
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tag" });
  }
};
