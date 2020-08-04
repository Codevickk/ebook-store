const Book = require('../models/bookModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const books = await features.query;
  // Send response
  res.status(200).json({
    status: 'success',
    count: books.length,
    data: {
      books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate('reviews')
    .populate('category');
  if (!book) {
    return next(new AppError('There is no book with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    return next(new AppError('There is no book with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return next(new AppError('There is no book with this id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
