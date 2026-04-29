import express from 'express';
import { getContacts, createContact } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getContacts)
  .post(createContact);

export default router;
