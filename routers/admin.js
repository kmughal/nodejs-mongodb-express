const express = require("express");
const router = express.Router();
// const path = require("path");
// const { adminController } = require("../controllers/admin");

// const {
// 	sequelizerAdminController
// } = require("../controllers/sequelizer/admin-sequelizer");

// router.get("/add-product", adminController.initProduct);

// router.post("/add-product", sequelizerAdminController.addProduct);

// router.get("/edit-product/:id", sequelizerAdminController.editProduct);

// router.post("/edit-product", sequelizerAdminController.updateProduct);

// router.get("/products", sequelizerAdminController.getProducts);

// router.post("/delete-product", sequelizerAdminController.deleteProduct);

// const { mongodbAdminController } = require("../controllers/mongo/admin");

// router.get("/add-product", mongodbAdminController.initProduct);

// router.post("/add-product", mongodbAdminController.addProduct);

// router.get("/edit-product/:id",mongodbAdminController.editProduct);

// router.post("/edit-product",mongodbAdminController.updateProduct);

// router.get("/products",mongodbAdminController.getProducts);

// router.post("/delete-product",mongodbAdminController.deleteProduct);

const { mongooseAdminController } = require("../controllers/mongoose/admin");
const { isAuth } = require("../middlewares/is-auth");
const { body } = require("express-validator/check");

router.get("/add-product", isAuth, mongooseAdminController.initProduct);

router.post(
	"/add-product",
	[
		body("title")
			.isLength({ min: 3 })
			.isAlphanumeric()
			.trim()
			.withMessage("Title is not valid"),
		body("price")
			.isNumeric()
			.withMessage("Provided price is not valid"),
		body("imageUrl")
			.isURL()
			.trim()
			.withMessage("Provided url is not valid"),
		body("description")
			.isLength({ min: 10 })
			.trim()
			.withMessage("Provided description is not valid")
	],
	isAuth,
	mongooseAdminController.addProduct
);

router.get("/edit-product/:id", isAuth, mongooseAdminController.editProduct);

router.post("/edit-product", isAuth, mongooseAdminController.updateProduct);

router.get("/products", mongooseAdminController.getProducts);

router.post("/delete-product", isAuth, mongooseAdminController.deleteProduct);

module.exports.router = router;
