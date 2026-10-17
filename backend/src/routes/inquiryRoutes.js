import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateInquiry } from '../validators/inquiryValidator.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public: Submit confidential inquiry with rate limiting and sanitization
router.post('/', inquiryLimiter, validateRequest(validateInquiry), submitInquiry);

// Protected Admin management endpoints
router.get('/', authenticateAdmin, getInquiries);
router.get('/:id', authenticateAdmin, getInquiryById);
router.patch('/:id/status', authenticateAdmin, updateInquiryStatus);
router.delete('/:id', authenticateAdmin, deleteInquiry);

export default router;
