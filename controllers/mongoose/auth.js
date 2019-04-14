const { cookieHelper } = require("../../common/cookie-helper");
const { UserModel } = require("../../models/mongoose/user");
const { passwordHelpers } = require("../../common/password-hashing");

exports.AuthController = class AuthController {
	index(req, res, next) {
		//const isAuthenticated = req.session.isAuthenticated;
		// console.log(req.session.isAuthenticated);
		const vm = {
			path: "login",
			title: "Sign in"
		};
		res.render("login/index", vm);
	}

	async signin(req, res, next) {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		if (!user) return res.redirect("/auth/signin");
		const validatePassword = await passwordHelpers.decrypt(
			password,
			user.password
		);
		if (!validatePassword) res.redirect("/auth/signin");

		req.user = user;
		res.setHeader("Set-Cookie", "isAuthenticated=true; max-age=10;");
		req.session.isAuthenticated = true;
		req.session.user = req.user;
		await req.session.save();
		res.redirect("/shop/product");
	}

	async logout(req, res, next) {
		await req.session.destroy(() => {
			res.redirect("/auth/signin");
		});
	}

	signup(req, res, next) {
		const vm = {
			path: "signup",
			title: "Sign up",
			isAuthenticated: false,
			
		};
		res.render("login/signup", vm);
	}

	async postSignup(req, res, next) {
		const { email, password, confirmPassword } = req.body;
		const userDetails = await UserModel.findOne({ email: email });
		if (userDetails) return res.redirect("login/signup");
		const hashedPassword = await passwordHelpers.encrypt(password);
		const newUser = new UserModel({
			email: email,
			password: hashedPassword,
			cart: { items: [] }
		});
		await newUser.save();
		res.redirect("/auth/signin");
	}
};
