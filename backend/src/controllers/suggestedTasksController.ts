import { Request, Response } from "express";
import { saveSuggestedTask, querySuggestedTasksByTags, getAllSuggestedTasksFromDB , deleteSuggestedTaskFromDB, updateSuggestedTaskName } from "../suggestedTasks/suggestedTasks";
import { io } from "../index"; 
import { getCallsFromDB } from "../calls/calls";

export const createSuggestedTask = async (req: Request, res: Response) => {
  const { name, tags } = req.body;

  if ( !name) {
    return res.status(400).json({ message: "Task name are required" });
  }

  try {
    await saveSuggestedTask( { name, tags });

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



export const fetchAllSuggestedTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllSuggestedTasksFromDB();
    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Failed to fetch all suggested tasks:", err);
    res.status(500).json({ message: "Failed to fetch all suggested tasks" });
  }
};

export const deleteSuggestedTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteSuggestedTaskFromDB(id);
    const allTasks = await querySuggestedTasksByTags([]);
    io.emit("suggestedTasksUpdated", allTasks);

    const updatedCalls = await getCallsFromDB();
    io.emit("callsUpdated", updatedCalls);

    res.status(200).json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const updateSuggestedTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await updateSuggestedTaskName(id, name);
    const allTasks = await querySuggestedTasksByTags([]);
    io.emit("suggestedTasksUpdated", allTasks);

    const updatedCalls = await getCallsFromDB();
    io.emit("callsUpdated", updatedCalls);

    res.status(200).json({ message: "Task updated" });
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
};
