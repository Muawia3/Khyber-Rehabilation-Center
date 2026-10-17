import { Router } from 'express';
import {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getStories);
router.get('/:slug', getStoryBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createStory);
router.put('/:id', authenticateAdmin, updateStory);
router.delete('/:id', authenticateAdmin, deleteStory);

export default router;
