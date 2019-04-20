const express = require("express");
const { check, body } = require("express-validator/check");

const routes = express.Router();
const { AuthController } = require("../controllers/mongoose/auth");
const ctrl = new AuthController();
const { UserModel } = require("../models/mongoose/user");

routes.get("/signin", ctrl.index);
routes.post("/signin", ctrl.signin);
routes.get("/logout", ctrl.logout);
routes.get("/signup", ctrl.signup);
routes.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email address!")
			.custom(async (value, { req }) => {
				const userDetails = await UserModel.findOne({ email: req.body.email });
				if (userDetails) throw new Error("account already exists!");
			}).normalizeEmail(),
		body("password").isLength({ min: 5 }),
		body("confirmPassword").custom((value, { req }) => {
			if (value !== req.body.password)
				throw new Error("Confirm password doesnt matches with password");
			return true;
		}).trim()
	],
	ctrl.postSignup
);
routes.get("/reset", ctrl.resetPassword);
routes.post("/reset", ctrl.postResetPassword);
routes.get("/reset/:token", ctrl.requestNewPassword);
routes.post("/postNewPassword", ctrl.postNewPasswordRequest);
exports.authRoutes = routes;
