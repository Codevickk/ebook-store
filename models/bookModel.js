const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A book must have a category'],
    },
    description: {
      type: String,
      required: [true, 'A book must have a description'],
    },
    author: {
      type: String,
      required: [true, 'A book must have an author'],
    },
    price: {
      type: Number,
      required: [true, 'A book must have a price'],
    },
    coverPhotos: {
      type: [String],
      required: [true, 'A book must have at least one photo'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The minimum rating is 1'],
      max: [5, 'The maximum rating is 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

// bookSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'category',
//     select: '-__v',
//   });
//   next();
// });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
