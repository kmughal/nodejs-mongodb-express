const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const {getSettings} = require("./setting-helper");
const settings = getSettings("send-grid");
const transporter = nodeMailer.createTransport(
	sendgridTransport({
		auth: {
			api_key: settings.api_key
		}
	})
);

exports.sendEmail = async (subject, message, to, from) => {
	try {
		await transporter.sendMail({
			html: message,
			from,
			to,
			subject
		});
	} catch (e) {
		console.log("Error occured sending email, e:", e);
	}
};
