import { Router } from 'express';
import { loginAdmin, getCurrentAdmin, logoutAdmin } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { validateLogin } from '../validators/authValidator.js';

const router = Router();

router.post('/login', validateRequest(validateLogin), loginAdmin);
router.post('/logout', authenticateAdmin, logoutAdmin);
router.get('/me', authenticateAdmin, getCurrentAdmin);

export default router;
