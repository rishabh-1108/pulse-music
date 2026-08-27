import { Router } from 'express';
import * as genreController from '../controllers/genre.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', authenticate, authorize('ADMIN'), genreController.createGenre);
router.put('/:id', authenticate, authorize('ADMIN'), genreController.updateGenre);
router.delete('/:id', authenticate, authorize('ADMIN'), genreController.deleteGenre);

export default router;
