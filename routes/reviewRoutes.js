const express = require('express');

//Import controllers for the routes
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');


const router = express.Router({ mergeParams: true });

// POST /books/dfkjsdfj/reviews
// GET /books/dsfhsdfsdf/reviews

//POST /reviews
// GET /reviews

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)


module.exports = router;