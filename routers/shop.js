// const path = require("path")
const express = require("express");
const router = express.Router();

// const { shopController } = require("../controllers/shop");

// const {
// 	shopSequelizerController
// } = require("../controllers/sequelizer/shop-sequelizer");

// router.get("/", shopController.createInitialViewModel);

// router.get("/index", shopController.getIndex);

// router.get("/product", shopSequelizerController.getProducts);

// router.get("/product/:id", shopSequelizerController.getProductById);

// router.get("/cart", shopSequelizerController.getCart);

// router.post("/cart", shopSequelizerController.addCart);

// router.get("/checkout", shopController.getCheckout);

// router.post("/create-order", shopSequelizerController.createOrder);

// router.get("/orders", shopSequelizerController.getOrders);

// router.post(
// 	"/remove-product-cart",
// 	shopSequelizerController.removePrdouctFromCart
// );

//Mongodb controller
// const { mongodbShopController } = require("../controllers/mongo/shop");

// router.get("/", mongodbShopController.createInitialViewModel);

// router.get("/index");

// router.get("/product", mongodbShopController.getProducts);

// router.get("/product/:id", mongodbShopController.getProductById);

// router.get("/cart", mongodbShopController.getCart);

// router.post("/cart", mongodbShopController.addCart);

// router.get("/checkout");

// router.post("/create-order",mongodbShopController.createOrder);

// router.get("/orders",mongodbShopController.getOrders);

// router.post(
// 	"/remove-product-cart",
// 	mongodbShopController.removePrdouctFromCart
// );

const { mongoosedbShopController } = require("../controllers/mongoose/shop");

const { isAuth } = require("../middlewares/is-auth");

router.get("/");

router.get("/index");

router.get("/product", mongoosedbShopController.getProducts);

router.get("/product/:id", isAuth, mongoosedbShopController.getProductById);

router.get("/cart", isAuth, mongoosedbShopController.getCart);

router.post("/cart", isAuth, mongoosedbShopController.addCart);

router.get("/checkout");

router.post("/create-order", isAuth, mongoosedbShopController.createOrder);

router.get("/orders", isAuth, mongoosedbShopController.getOrders);

router.post(
	"/remove-product-cart",
	isAuth,
	mongoosedbShopController.removePrdouctFromCart
);

module.exports = router;
