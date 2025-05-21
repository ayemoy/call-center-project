import { Request, Response } from 'express';
import { getCallsFromDB , createCallInDB, checkCallExists } from '../calls/calls';

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

  if (!name) {
    return res.status(400).json({ message: "Call name is required" });
  }

  const exists = await checkCallExists(name);
  if (exists) {
    return res.status(400).json({ message: "Call with this name already exists" });
  }

  const newCall = await createCallInDB(name);
  res.status(201).json({ call: newCall });
};
