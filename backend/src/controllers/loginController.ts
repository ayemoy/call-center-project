import { Request, Response } from 'express';
import { handleLogin } from '../login/login';

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
        }

        const user = await handleLogin(email, password);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(401).json({ message: error.message || 'Login failed' });
    }
};

export default loginUser;
