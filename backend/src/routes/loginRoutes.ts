import express from 'express';
import loginUser from '../controllers/loginController';

const router = express.Router();

// POST /api/login
router.post('/login', loginUser);

export default router;
