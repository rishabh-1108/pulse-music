import { Router } from 'express';
import * as searchController from '../controllers/search.controller';

const router = Router();

router.get('/', searchController.search);
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/categories', searchController.getBrowseCategories);

export default router;
