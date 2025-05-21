import express from 'express';
import { getTagsController, createTagController, renameTagController, deleteTagController } from '../controllers/tagsController';

const router = express.Router();

router.get("/tags", getTagsController);
router.post("/tags", createTagController);
router.put("/tags/rename", renameTagController);
router.delete("/tags/:name", deleteTagController);

export default router;