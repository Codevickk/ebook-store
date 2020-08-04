const mongoose = require('mongoose');
const Book = require('./bookModel');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'A review must belong to a book'],
    },
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'book',
  //   select: 'title',
  // }).populate({
  //   path: 'user',
  //   select:  'username photo'
  // });
  this.populate({
    path: 'user',
    select: 'username photo',
  });
  next();
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (bookId) {
  // this here points to the current model

  // Use aggregation pipeline to group reviews by a bookId
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Book.findByIdAndUpdate(bookId, {
    ratingsAverage: stats[0].averageRating,
    ratingsQuantity: stats[0].nRating,
  });
};

reviewSchema.post('save', function () {
  // this points to the current document
  this.constructor.calcAverageRatings(this.book);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
