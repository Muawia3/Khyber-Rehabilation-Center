import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncementBySlug,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getAnnouncements);
router.get('/:slug', getAnnouncementBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createAnnouncement);
router.put('/:id', authenticateAdmin, updateAnnouncement);
router.delete('/:id', authenticateAdmin, deleteAnnouncement);

export default router;
