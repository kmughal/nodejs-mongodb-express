const {
  Product
} = require("../models/product");

const {
  SqlProduct
} = require("../models/sql-product");


const adminController = ({
  initProduct(req, res, next) {
    var vm = {
      title: "Add new Product",
      path: "add-product",
      activeShop: false,
      activeAddProduct: true
    };
    res.render("admin/add-product", vm);
  },

  async addProduct(req, res, next) {
    const {
      title,
      description,
      imageUrl,
      price
    } = req.body;

    try {
      const newProduct = new SqlProduct(title, description, price, imageUrl);
      await newProduct.save();
    } catch (e) {
      throw new Error("Fail to save product");
    }
    res.redirect("/admin/add-product");
  },
  async editProduct(req, res, next) {
    const {
      id
    } = req.params;

    try {
      const product = await SqlProduct.getProductById(id);
      if (product) {
        return res.render("product/edit-product", {
          path: "edit-product",
          title: `Edit - ${product.title}`,
          product
        });
      } else
        return res.render("/admin/edit-product");
    } catch (e) {
      throw new Error("Fail to save product");
    }
    res.render("/admin/add-product");
  },
  async getProducts(req, res, next) {
    const products = await SqlProduct.getAll();
    res.render("admin/product-list", {
      title: "Admin Products",
      path: "admin-product",
      products
    });

  },
  async updateProduct(req, res, next) {
    try {
      const {
        id,
        title,
        description,
        price,
        imageUrl
      } = req.body;
      let product = new SqlProduct(title, description, price, imageUrl);
      product.id = id;
      await SqlProduct.update(product);
      res.send("updated");
    } catch (e) {
      throw new Error("Admin.UpdateProduct failed, error:", e);
    }
  },
  async deleteProduct(req, res, next) {
    try {
      const {
        id
      } = req.body;
      const result = await SqlProduct.deleteProduct(id);
      if (!result) throw new Error("Fail to delete the product");
      res.redirect("/admin/products");
    } catch (e) {
      throw new Error("Shop.deleteProduct failed,Error:", e);
    }

  }

});

exports.adminController = adminController;