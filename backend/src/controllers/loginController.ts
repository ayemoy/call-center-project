import { Request, Response } from 'express';
import { handleLogin } from '../login/login';
// import * as admin from 'firebase-admin';
import admin from '../firebaseAdmin'; // הנתיב לפי ההגדרה שלך

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("✅ Token decoded:", decoded);
    const uid = decoded.uid;

    const user = await handleLogin(uid);
    console.log("✅ Firestore user:", user);

    res.status(200).json({ user });
  } catch (err: any) {
    console.error('loginController:', err);
    res.status(401).json({ message: err.message || 'Unauthorized' });
  }
};
