import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile/:username', userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, userController.changePassword);
router.post('/:id/follow', authenticate, userController.followUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.post('/likes/songs/:songId', authenticate, userController.likeSong);
router.post('/likes/albums/:albumId', authenticate, userController.likeAlbum);
router.get('/likes/songs', authenticate, userController.getLikedSongs);
router.get('/likes/albums', authenticate, userController.getLikedAlbums);
router.get('/history', authenticate, userController.getHistory);
router.delete('/account', authenticate, userController.deleteAccount);

export default router;
