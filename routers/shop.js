const path = require("path")
const express = require("express");
const router = express.Router();

const {
  shopController
} = require("../controllers/shop");

const {shopSequelizerController} = require("../controllers/sequelizer/shop-sequelizer");

router.get("/", shopController.createInitialViewModel);

router.get("/index",shopController.getIndex);

router.get("/product",shopSequelizerController.getProducts);

router.get("/product/:id",shopSequelizerController.getProductById);

router.get("/cart",shopSequelizerController.getCart);

router.post("/cart",shopSequelizerController.addCart);

router.get("/checkout",shopController.getCheckout);

router.post("/create-order" , shopSequelizerController.createOrder)

router.get("/orders",shopSequelizerController.getOrders);

router.post("/remove-product-cart" , shopSequelizerController.removePrdouctFromCart)

module.exports = router;