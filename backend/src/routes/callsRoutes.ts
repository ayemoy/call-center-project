import express from 'express';
import { getAllCalls, createNewCall , addTaskToCall, updateCallTags, updateTaskStatus, deleteTaskFromCall} from '../controllers/callsController';

const router = express.Router();

router.get("/calls", getAllCalls);
router.post("/calls", createNewCall);
router.post("/calls/:callId/tasks", addTaskToCall);
router.put("/calls/:callId/tags", updateCallTags);
router.put("/calls/:callId/tasks/:taskId", updateTaskStatus);
router.delete("/calls/:callId/tasks/:taskName", deleteTaskFromCall);



export default router;
