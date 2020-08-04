const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: [true, 'A category name must be unique']
    },
    description: {
        type: String,
        required: [true, 'A category must have a description'],
        minlength: [6, 'A category description must not be less than  6 characters']
    }
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;