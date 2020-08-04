const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
	const message = `Invalid ${error.path}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
	const duplicateVal = error.keyValue.name;
	const message = `Duplicate field value '${duplicateVal}' , please use another value!`;
	return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token!, Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired!, Please log in again!', 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	// Operational errors, send them to the client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		// Programming errors, just send a very friendly message
		// log the error
		console.error('Error: ', err);

		// Send the client a friendly response
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!'
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if(error.name === 'JsonWebTokenError') error = handleJWTError();
		if(error.name === 'TokenExpiredError') error = handleJWTExpiredError()
		sendErrorProd(error, res);
	}
};
