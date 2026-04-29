import express from 'express';
import { getDeals, updateDeal, createDeal } from '../controllers/dealController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getDeals)
  .post(createDeal);

router.route('/:id')
  .put(updateDeal);

export default router;
