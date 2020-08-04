const nodemailer = require('nodemailer');

const sendEmail = (options) => {
	// 1. Create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	// 2. Define the mail options
	const mailOptions = {
		from: 'Adeniji Victor <codevickk@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message
		// html
	};

	// 3. Actually send the mail
	transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
