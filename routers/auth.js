const express = require("express");

const routes = express.Router();
const {AuthController} = require("../controllers/mongoose/auth");
const ctrl = new AuthController();

routes.get("/signin" , ctrl.index);
routes.post("/signin" , ctrl.signin);

exports.authRoutes = routes;