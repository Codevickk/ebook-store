const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.createUser = catchAsync(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		status: 'success',
		user
	})
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    
	res.status(200).json({
		status: 'success',
		count: users.length,
		data: {
			users
		}
	});
});

