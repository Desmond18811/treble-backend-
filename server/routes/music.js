import express from 'express';
import { searchMusic } from '../controllers/musicController.js';

const router = express.Router();

router.get('/search', searchMusic);

export default router;
