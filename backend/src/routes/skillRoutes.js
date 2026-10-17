import { Router } from 'express';
import {
  getSkills,
  getSkillBySlug,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getSkills);
router.get('/:slug', getSkillBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createSkill);
router.put('/:id', authenticateAdmin, updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;
