const {cookieHelper} = require("../../common/cookie-helper");

exports.AuthController = class AuthController {
	index(req, res, next) {
		const isAuthenticated = cookieHelper.isAuthenticated(req);
		const vm = {
			path: "login",
			title: "Sign in",
			isAuthenticated : isAuthenticated
		};
		res.render("login/index", vm);
	}

	signin(req, res, next) {
		cookieHelper.isAuthenticated(req) = true;
		res.setHeader("SET-COOKIE" , "isAuthenticated=true")
		res.redirect("/auth/signin");
	}
};
