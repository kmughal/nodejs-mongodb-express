
const {
  ProductModel
} = require("../../models/orms/product");


const sequelizerAdminController = ({
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

      await req.user.createProduct({
        title,
        description,
        imageUrl,
        price
      });

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
      const product = await req.user.getProducts({where : {id : id}});
     
      if (product.length) {
        return res.render("product/edit-product", {
          path: "edit-product",
          title: `Edit - ${product.title}`,
          product: product[0].dataValues
        });
      } else
        return res.render("/admin/edit-product");
    } catch (e) {
      throw new Error("Fail to save product");
    }
    res.render("/admin/add-product");
  },
  async getProducts(req, res, next) {
    const products = await req.user.getProducts();
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
      const product = await ProductModel.findByPk(id);
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      await product.save();
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
      const product = await ProductModel.findByPk(id);
      if (product) await product.destroy();
      else throw new Error("Fail to delete the product");
      res.redirect("/admin/products");
    } catch (e) {
      throw new Error("Shop.deleteProduct failed,Error:", e);
    }

  }

});

exports.sequelizerAdminController = sequelizerAdminController;