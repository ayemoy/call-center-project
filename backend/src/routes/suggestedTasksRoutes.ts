import express from 'express';
import { createSuggestedTask } from '../controllers/suggestedTasksController';

const router = express.Router();

router.post("/suggestedTasks", createSuggestedTask);

export default router;
