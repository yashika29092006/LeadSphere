import express from 'express';
import { getLeads, createLead, convertLead } from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection to all lead routes
router.use(protect);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.put('/:id/convert', convertLead);

export default router;
