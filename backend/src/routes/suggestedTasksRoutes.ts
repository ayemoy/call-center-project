import express from 'express';
import { createSuggestedTask } from '../controllers/suggestedTasksController';

const router = express.Router();

router.post("/suggested-tasks/:id", createSuggestedTask);

export default router;
