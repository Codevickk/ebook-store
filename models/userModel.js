const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [ true, 'A user must have a username' ],
		unique: [ true, 'A username must be unique' ]
	},
	email: {
		type: String,
		required: [ true, 'A user must have an email' ],
		unique: true,
		lowercase: true,
		validate: [ validator.isEmail, 'Please provide a valid email' ]
	},
	role: {
		type: String,
		enum: [ 'admin', 'user' ],
		default: 'user'
	},
	password: {
		type: String,
		required: [ true, 'Please provide a password' ],
		minlength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [ true, 'Please confirm your password' ],
		validate: {
			// This only works on CREATE() and SAVE()!!!
			validator: function(el) {
				return el === this.password;
			},
			message: 'Passwords are not the same'
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	photo: String
});

// Document middleware, runs before save() and create()
userSchema.pre('save', async function(next) {
	// only perform other operations  if the password is modified
	if (!this.isModified('password')) return next();

	// hash the password with a cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// delete the passwordConfirm field
	this.passwordConfirm = undefined;
});

userSchema.pre('save', function(next) {
	// only perform other operations if the password is modified or the document is not new
	if(!this.isModified('password') || this.isNew ) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	// candidate password stands for the unhashed password that the user enters
	// user password stands for the hashed password in the database
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimeStamp;
	}
	// FALSE means  the password has not changed after the jwt token has been issued
	return false;
};

userSchema.methods.createPasswordResetToken = function() {
	// create a random string in hexadecimal format
	const resetToken = crypto.randomBytes(32).toString('hex');
	// hash the token and save to the passwordResetToken field in the current document
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // The password reset will expire after 10 seconds
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // return plain token
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
