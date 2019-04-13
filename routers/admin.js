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

const {mongooseAdminController} = require("../controllers/mongoose/admin");

router.get("/add-product",mongooseAdminController.initProduct);

router.post("/add-product",mongooseAdminController.addProduct);

router.get("/edit-product/:id",mongooseAdminController.editProduct);

router.post("/edit-product",mongooseAdminController.updateProduct);

router.get("/products",mongooseAdminController.getProducts);

router.post("/delete-product",mongooseAdminController.deleteProduct);

module.exports.router = router;
