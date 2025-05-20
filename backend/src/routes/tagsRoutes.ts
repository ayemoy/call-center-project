import express from 'express';
import { getTagsController, createTagController } from '../controllers/tagsController';

const router = express.Router();

router.get("/tags", getTagsController);
router.post("/tags", createTagController);

export default router;