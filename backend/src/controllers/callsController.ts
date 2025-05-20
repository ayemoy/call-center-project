import { Request, Response } from 'express';
import { getCallsFromDB } from '../calls/calls';

export const getAllCalls = async (req: Request, res: Response) => {
  try {
    const calls = await getCallsFromDB();
    res.status(200).json({ calls });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch calls" });
  }
};
