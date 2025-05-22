import { Request, Response } from 'express';
import { getCallsFromDB , createCallInDB, checkCallExists ,addTaskToCallInDB, updateCallTagsInDB, updateTaskStatusInCall  } from '../calls/calls';
import { io } from '../index';


export const getAllCalls = async (req: Request, res: Response) => {
  try {
    const calls = await getCallsFromDB();
    res.status(200).json({ calls });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch calls" });
  }
};



export const createNewCall = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Call name is required" });

  const exists = await checkCallExists(name);
  if (exists) return res.status(400).json({ message: "Call with this name already exists" });

  const newCall = await createCallInDB(name);
  const allCalls = await getCallsFromDB();
  io.emit("callsUpdated", allCalls);

  res.status(201).json({ call: newCall });
};




export const addTaskToCall = async (req: Request, res: Response) => {
  const { callId } = req.params;
  const { id, name } = req.body;

  if (!id || !name) return res.status(400).json({ message: "Task ID and name are required" });

  try {
    const task = await addTaskToCallInDB(callId, { id, name });
    const allCalls = await getCallsFromDB();
    io.emit("callsUpdated", allCalls);
    res.status(201).json({ task });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to add task" });
  }
};




export const updateCallTags = async (req: Request, res: Response) => {
  const { callId } = req.params;
  const { tags } = req.body;

  if (!Array.isArray(tags)) return res.status(400).json({ message: "Tags must be an array" });

  try {
    await updateCallTagsInDB(callId, tags);
    const allCalls = await getCallsFromDB();
    io.emit("callsUpdated", allCalls);
    res.status(200).json({ message: "Tags updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update tags" });
  }
};




export const updateTaskStatus = async (req: Request, res: Response) => {
  const { callId, taskId } = req.params;
  const { status } = req.body;

  try {
    await updateTaskStatusInCall(callId, taskId, status);
    const allCalls = await getCallsFromDB();
    io.emit("callsUpdated", allCalls);
    res.status(200).json({ message: "Task status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task status" });
  }
};
