import { Router } from 'express';
import {
  getTreatments,
  getTreatmentBySlug,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from '../controllers/treatmentController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getTreatments);
router.get('/:slug', getTreatmentBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createTreatment);
router.put('/:id', authenticateAdmin, updateTreatment);
router.delete('/:id', authenticateAdmin, deleteTreatment);

export default router;
