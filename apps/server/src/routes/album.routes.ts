import { Router } from 'express';
import * as albumController from '../controllers/album.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, albumController.getAlbums);
router.get('/:id', optionalAuth, albumController.getAlbumById);
router.post('/', authenticate, albumController.createAlbum);
router.put('/:id', authenticate, albumController.updateAlbum);
router.delete('/:id', authenticate, albumController.deleteAlbum);

export default router;
