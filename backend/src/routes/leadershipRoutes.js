import { Router } from 'express';
import {
  getLeadershipTree,
  getLeadershipForAdmin,
  createLeadershipMember,
  updateLeadershipMember,
  deleteLeadershipMember,
  reorderLeadershipMembers,
} from '../controllers/leadershipController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoint: Get leadership tree and members
router.get('/', getLeadershipTree);

// Protected Admin endpoints
router.get('/admin', authenticateAdmin, getLeadershipForAdmin);
router.post('/', authenticateAdmin, createLeadershipMember);
router.put('/reorder', authenticateAdmin, reorderLeadershipMembers);
router.put('/:id', authenticateAdmin, updateLeadershipMember);
router.delete('/:id', authenticateAdmin, deleteLeadershipMember);

export default router;
