import express from 'express';
import { getPlaylists, createPlaylist, addTrackToPlaylist } from '../controllers/playlistController.js';

const router = express.Router();

router.get('/', getPlaylists);
router.post('/', createPlaylist);
router.post('/:id/tracks', addTrackToPlaylist);

export default router;
