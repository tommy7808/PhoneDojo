import { Router } from 'express';
import { isLoggedIn, isAuthorisedReview } from '../utils/middleware.js';
import { createReview, deleteReview } from '../controllers/reviews.js';

const router = Router({ mergeParams: true });

router.post('/', isLoggedIn, createReview);
router.delete('/:reviewID', isLoggedIn, isAuthorisedReview, deleteReview);

export default router;