const { Router } = require('express');
const { isLoggedIn, isAuthorisedReview } = require('../utils/middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

const router = Router({ mergeParams: true });

router.post('/', isLoggedIn, createReview);
router.delete('/:reviewID', isLoggedIn, isAuthorisedReview, deleteReview);

module.exports = router;