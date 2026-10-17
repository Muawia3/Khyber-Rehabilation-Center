import { Router } from 'express';
import {
  getBusiness,
  getBusinessBySlug,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '../controllers/businessController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getBusiness);
router.get('/:slug', getBusinessBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createBusiness);
router.put('/:id', authenticateAdmin, updateBusiness);
router.delete('/:id', authenticateAdmin, deleteBusiness);

export default router;
