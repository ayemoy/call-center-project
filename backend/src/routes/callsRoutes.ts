import express from 'express';
import { getAllCalls, createNewCall } from '../controllers/callsController';

const router = express.Router();

router.get("/calls", getAllCalls);
router.post("/calls", createNewCall);

export default router;
