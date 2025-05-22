import express from 'express';
import { createSuggestedTask, getSuggestedTasksByTags,fetchAllSuggestedTasks, deleteSuggestedTask, updateSuggestedTask } from '../controllers/suggestedTasksController';

const router = express.Router();

router.post("/suggestedTasks", createSuggestedTask);
router.post("/suggestedTasks/by-tags", getSuggestedTasksByTags);
router.get("/suggestedTasks/all", fetchAllSuggestedTasks);
router.delete("/suggestedTasks/:id", deleteSuggestedTask);
router.put("/suggestedTasks/:id", updateSuggestedTask);


export default router;
