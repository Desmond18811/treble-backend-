import express from 'express';
import { searchMusic, getRecommendations } from '../controllers/musicController.js';

const router = express.Router();

router.get('/search', searchMusic);
router.get('/recommendations', getRecommendations);

export default router;
