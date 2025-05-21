import express from 'express';
import { getAllCalls, createNewCall , addTaskToCall, updateCallTags} from '../controllers/callsController';

const router = express.Router();

router.get("/calls", getAllCalls);
router.post("/calls", createNewCall);
router.post("/calls/:callId/tasks", addTaskToCall);
router.put("/calls/:callId/tags", updateCallTags);
export default router;
