import { Router } from 'express';
import * as songController from '../controllers/song.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, songController.getSongs);
router.get('/trending', songController.getTrendingSongs);
router.get('/new-releases', songController.getNewReleases);
router.get('/recommended', optionalAuth, songController.getRecommendedSongs);
router.get('/:id', optionalAuth, songController.getSongById);
router.post('/', authenticate, songController.createSong);
router.put('/:id', authenticate, songController.updateSong);
router.delete('/:id', authenticate, songController.deleteSong);
router.post('/:id/play', optionalAuth, songController.incrementPlayCount);

export default router;
