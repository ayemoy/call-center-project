import { Request, Response } from "express";
import { saveSuggestedTask, querySuggestedTasksByTags } from "../suggestedTasks/suggestedTasks";
import { io } from "../index"; 


export const createSuggestedTask = async (req: Request, res: Response) => {
  const { id, name, tags } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "Task ID and name are required" });
  }

  try {
    await saveSuggestedTask(id, { name, tags });

    const allTasks = await querySuggestedTasksByTags([]); 
    io.emit("suggestedTasksUpdated", allTasks);         

    res.status(201).json({ message: "Suggested task created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save suggested task" });
  }
};



export const getSuggestedTasksByTags = async (req: Request, res: Response) => {
  const { tags } = req.body;
  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ message: "Tags are required" });
  }

  try {
    const tasks = await querySuggestedTasksByTags(tags);
    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching suggested tasks:", err);
    res.status(500).json({ message: "Failed to fetch suggested tasks" });
  }
};