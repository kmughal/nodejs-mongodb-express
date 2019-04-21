const { cookieHelper } = require("../../common/cookie-helper");
const { UserModel } = require("../../models/mongoose/user");
const { passwordHelpers } = require("../../common/password-hashing");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const { sendEmail } = require("../../common/send-email");
const { toObjectId } = require("../../infrastructure/mongodb");

exports.AuthController = class AuthController {
	index(req, res, next) {
		//const isAuthenticated = req.session.isAuthenticated;
		const errorMessages = req.flash("error");
		const vm = {
			path: "auth",
			title: "Sign in",
			errorMessages,
			oldValues : {
				email : '' , password : ''
			},
			validationErrors : []
		};
		res.render("auth/signin", vm);
	}

	async signin(req, res, next) {
		const errors = validationResult(req);
		const { email, password } = req.body;
		if (!errors.isEmpty()) {
			return res.status(422).render("auth/signin", {
				path: "auth",
				title: "Sign in",
				errorMessages: errors.array().map(e => e.msg),
				oldValues: {
					email,
					password
				},
				validationErrors: errors.array()
			});
		}

		const user = await UserModel.findOne({ email });
		if (!user) {
			
			return res.status(422).render("auth/signin", {
				path: "auth",
				title: "Sign in",
				errorMessages: ["Invalid account information."],
				oldValues: {
					email,
					password
				},
				validationErrors: [{ param: "email" }, { param: "password" }]
			});
		}
		const validatePassword = await passwordHelpers.decrypt(
			password,
			user.password
		);
		if (!validatePassword) {
			return res.status(422).render("auth/signin", {
				path: "auth",
				title: "Sign in",
				errorMessages: ["Invalid account information."],
				oldValues: {
					email,
					password
				},
				validationErrors: [{ param: "email" }, { param: "password" }]
			});
		}

		req.user = user;
		res.setHeader("Set-Cookie", "isAuthenticated=true; max-age=10;");
		req.session.isAuthenticated = true;
		req.session.user = req.user;
		await req.session.save();
		await sendEmail(
			"You are signed in",
			"Just to let you know that you logged in",
			"kmughal@gmail.com",
			"kmughal@gmail.com"
		);
		res.redirect("/shop/product");
	}

	async logout(req, res, next) {
	
		await req.session.destroy(() => {
			res.redirect("/auth/signin");
		});
	}

	signup(req, res, next) {
		const errorMessages = req.flash("error");
		const vm = {
			path: "signup",
			title: "Sign up",
			isAuthenticated: false,
			errorMessages,
			oldValues: {
				email: "",
				password: "",
				confirmPassword: ""
			},
			validationErrors: []
		};
		res.render("auth/signup", vm);
	}

	async postSignup(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).render("auth/signup", {
				path: "signup",
				title: "Sign up",
				isAuthenticated: false,
				errorMessages: errors.array().map(e => e.msg),
				oldValues: {
					email: req.body.email,
					password: req.body.password,
					confirmPassword: req.body.confirmPassword
				},
				validationErrors: errors.array()
			});
		}

		const { email, password, confirmPassword } = req.body;

		const hashedPassword = await passwordHelpers.encrypt(password);
		const newUser = new UserModel({
			email: email,
			password: hashedPassword,
			cart: { items: [] }
		});
		await newUser.save();
		res.redirect("/auth/signin");
	}

	resetPassword(req, res, next) {
		const errorMessages = req.flash("error");
		res.render("auth/resetpassword", {
			path: "resetpassword",
			title: "Reset password",
			errorMessages
		});
	}

	async postResetPassword(req, res, next) {
		try {
			const { email } = req.body;
			const user = await UserModel.findOne({ email });
			if (!user) {
				req.flash("error", `${email} not found!`);
				return res.redirect("/auth/reset");
			}

			// Send email
			const buffer = await crypto.randomBytes(32);
			const token = buffer.toString("hex");
			user.resetToken = token;
			const dd = new Date();
			dd.setHours(dd.getHours() + 1);
			user.resetTokenExpiration = dd;
			await user.save();

			await sendEmail(
				"Password reset request",
				`
				<p>You have requested to reset password.</p>
				<p>Click this <a href='http://localhost:3000/auth/reset/${token}'>link</a> to continue with your request.</p>
			`,
				"kmughal@gmail.com",
				"kmughal@gmail.com"
			);
			res
				.status(200)
				.send("An email has been sent for reset please check your inbox!");
		} catch (e) {
			console.log("PostResetPassword Error, e:", e);
		}
	}

	async requestNewPassword(req, res, next) {
		const { token } = req.params;

		const user = await UserModel.findOne({
			resetToken: token,
			resetTokenExpiration: { $gt: Date.now() }
		});
	
		if (typeof user === undefined) {
			req.flash("error", "user not found");
			return res.redirect("/auth/reset");
		}
	

		res.render("auth/new-password", {
			userId: user._id.toString(),
			passwordToken: token,
			path: "NewPassword",
			title: "New Password",
			errorMessages: []
		});
	}

	async postNewPasswordRequest(req, res, next) {
		const { userId, password, confirmPassword, passwordToken } = req.body;
		const user = await UserModel.findOne({
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() },
			_id: toObjectId(userId)
		});

		if (!user) {
			req.flash("error", "user not found!");
			return res.redirect("/auth/reset");
		}

		user.password = await passwordHelpers.encrypt(password);
		user.confirmPassword = await passwordHelpers.encrypt(confirmPassword);
		user.resetToken = null;
		user.resetTokenExpiration = null;
		await user.save();
		await sendEmail(
			"Password changed successfully",
			`
			<p> Dear ${
				user.email
			} , your password has been changed please click <a href='http://localhost:3000/auth/signin'> here </a> to sign in.</p>
			<p> Regards , </p>
			<h2>Mongo course team!</h2>
		`,
			"kmughal@gmail.com",
			"kmughal@gmail.com"
		);
		res.redirect("/auth/signin");
	}
};
