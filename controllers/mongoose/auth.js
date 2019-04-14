const { cookieHelper } = require("../../common/cookie-helper");

exports.AuthController = class AuthController {
	index(req, res, next) {
		//const isAuthenticated = req.session.isAuthenticated;
		console.log(req.session.isAuthenticated);
		const vm = {
			path: "login",
			title: "Sign in",
			isAuthenticated: req.session.isAuthenticated
		};
		res.render("login/index", vm);
	}

	async signin(req, res, next) {
		res.setHeader("Set-Cookie", "isAuthenticated=true; max-age=10;");
		req.session.isAuthenticated = true;
		req.session.user = req.user;
		await req.session.save();
		res.redirect("/auth/signin");
	}

	async logout(req, res, next) {
		await req.session.destroy(() => {
			res.redirect("/auth/signin");
		});
	}

	signup(req, res, next) {
		const vm = { path: "signup", title: "Sign up",isAuthenticated:false };
		res.render("login/signup", vm);
	}

	postSignup(req,res,next) {

	}
};
