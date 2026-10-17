import { Router } from 'express';
import { getDashboardOverview } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protected admin dashboard metrics
router.get('/dashboard', authenticateAdmin, getDashboardOverview);

export default router;
