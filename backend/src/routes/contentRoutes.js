import { Router } from 'express';
import {
  getContent,
  getContentByKey,
  upsertContent,
  deleteContent,
  uploadImage,
} from '../controllers/contentController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getContent);
router.get('/:key', getContentByKey);

// Protected admin endpoints
router.post('/upload', authenticateAdmin, uploadImage);
router.post('/', authenticateAdmin, upsertContent);
router.put('/:key', authenticateAdmin, upsertContent);
router.delete('/:key', authenticateAdmin, deleteContent);

export default router;
