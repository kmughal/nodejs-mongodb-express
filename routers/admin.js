const express = require("express");
const router = express.Router();
const path = require("path");
const {
  adminController
} = require("../controllers/admin")

const {sequelizerAdminController} = require("../controllers/sequelizer/admin-sequelizer")

router.get("/add-product", adminController.initProduct);

router.post("/add-product", sequelizerAdminController.addProduct);

router.get("/edit-product/:id" , sequelizerAdminController.editProduct)

router.post("/edit-product" , sequelizerAdminController.updateProduct)

router.get("/products", sequelizerAdminController.getProducts);

router.post("/delete-product" , sequelizerAdminController.deleteProduct)

module.exports.router = router;