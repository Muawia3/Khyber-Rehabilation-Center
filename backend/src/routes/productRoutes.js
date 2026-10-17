import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', getProducts);
router.get('/:id', getProductBySlug);

// Protected admin endpoints
router.post('/', authenticateAdmin, createProduct);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;
