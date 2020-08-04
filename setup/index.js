// Require modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Require models
const Category = require('../models/categoryModel');

// read config file to process/env
dotenv.config({
    path: '../config.env'
})

// Database connection
const DB = process.env.LOCAL_DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then((con) => {
    console.log('DB Connected Successfully!')
} );

// Fetch data from data.json
const { category } =JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

// Function to import the data into the database
const importData = async () => {
    try {
        await Category.create(category);
        console.log('Data imported succesfully')
    }
    catch(err) {
        console.log(err);
    }
}
importData();



