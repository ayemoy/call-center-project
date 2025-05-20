import { Request, Response, RequestHandler } from 'express';
import { getAllTags, addTagIfNotExists } from '../tags/tags';

export const getTagsController: RequestHandler = async (req, res) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({ tags });
  } catch (err) {
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
    res.status(200).json({ message: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to create tag" });
  }
};

