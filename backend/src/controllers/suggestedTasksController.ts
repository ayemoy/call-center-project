import { Request, Response } from "express";
import { saveSuggestedTask } from "../suggestedTasks/suggestedTasks";

export const createSuggestedTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, tags } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "Task ID and name are required" });
  }

  try {
    await saveSuggestedTask(id, { name, tags });
    res.status(201).json({ message: "Suggested task created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save suggested task" });
  }
};
