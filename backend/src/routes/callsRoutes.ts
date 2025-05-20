import express from 'express';
import { getAllCalls } from '../controllers/callsController';

const router = express.Router();

router.get("/calls", getAllCalls);

export default router;
