import { Router } from 'express';
import * as artistController from '../controllers/artist.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, artistController.getArtists);
router.get('/slug/:slug', optionalAuth, artistController.getArtistBySlug);
router.get('/:id', optionalAuth, artistController.getArtistById);
router.post('/', authenticate, artistController.createArtist);
router.put('/:id', authenticate, artistController.updateArtist);
router.post('/:id/follow', authenticate, artistController.followArtist);
router.get('/:id/follow/check', authenticate, artistController.checkArtistFollow);

export default router;
