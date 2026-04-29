import express from 'express';
import { getAccounts, createAccount } from '../controllers/accountController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getAccounts)
  .post(createAccount);

export default router;
