import { Router } from 'express';
import * as playlistController from '../controllers/playlist.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, playlistController.getUserPlaylists);
router.get('/public', optionalAuth, playlistController.getPublicPlaylists);
router.get('/:id', optionalAuth, playlistController.getPlaylistById);
router.post('/', authenticate, playlistController.createPlaylist);
router.put('/:id', authenticate, playlistController.updatePlaylist);
router.delete('/:id', authenticate, playlistController.deletePlaylist);
router.post('/:id/songs', authenticate, playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', authenticate, playlistController.removeSongFromPlaylist);
router.put('/:id/reorder', authenticate, playlistController.reorderPlaylist);

export default router;
