const express = require('express');

//Import controllers for the routes
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// POST /books/dfkjsdfj/reviews
// GET /books/dsfhsdfsdf/reviews
router.use('/:bookId/reviews', reviewRouter)

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.createBook
  );

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.deleteBook
  );

module.exports = router;
