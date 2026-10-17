import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import treatmentRoutes from './treatmentRoutes.js';
import skillRoutes from './skillRoutes.js';
import businessRoutes from './businessRoutes.js';
import productRoutes from './productRoutes.js';
import storyRoutes from './storyRoutes.js';
import contentRoutes from './contentRoutes.js';
import announcementRoutes from './announcementRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import leadershipRoutes from './leadershipRoutes.js';

const router = Router();

// API V1 Core Endpoints
router.use('/health', healthRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/treatments', treatmentRoutes);
router.use('/skills', skillRoutes);
router.use('/business', businessRoutes);
router.use('/products', productRoutes);
router.use('/stories', storyRoutes);
router.use('/content', contentRoutes);
router.use('/announcements', announcementRoutes);
router.use('/leadership', leadershipRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;
