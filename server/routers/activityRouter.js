import express from 'express';
import { getActivities, createActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/', createActivity);
router.get('/:entityType/:entityId', getActivities);

export default router;
