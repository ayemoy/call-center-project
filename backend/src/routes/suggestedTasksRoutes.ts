import express from 'express';
import { createSuggestedTask, getSuggestedTasksByTags  } from '../controllers/suggestedTasksController';

const router = express.Router();

router.post("/suggestedTasks", createSuggestedTask);
router.post("/suggestedTasks/by-tags", getSuggestedTasksByTags);


export default router;
