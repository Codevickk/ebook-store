const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catch unhandled errors from synchronous code
process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	console.log('Unhandled Exception, Shutting down...');
	process.exit(1);
});

// require app
const app = require('./app');

// This reads the config file to process.env
dotenv.config({
	path: './config.env'
});

// Connect to the database
const DB = process.env.LOCAL_DATABASE;
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then((con) => {
		console.log('DB Connected Successfully!');
	});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`app running on ${port}`);
});

// Handle bugs from async code
process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('Unhandled Rejection, Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});
