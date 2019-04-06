const path = require("path");

const filePath = path
  .resolve(__dirname, "../data-store/product.json");

const {
  JsonUpdater
} = require("../common/json-updater");

// const {
//   Cart
// } = require("../models/cart");

class Product {

  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  static async update(product) {
    try {

      const products = await Product.getAll();
      await JsonUpdater.write(filePath,
        [...(products.find(p => p.id !== product.id) || []), product]);
    } catch (e) {
      throw new Error("Product.update failed,error:", e)
    }
  }

  async save() {
    try {
      this.id = Math.random().toString();
      const products = await Product.getAll();
      products.push(this);
      await JsonUpdater.write(filePath, products);
      return;
    } catch (e) {
      throw new Error("Fail: Save product");
    }
  }

  static async getProductById(id) {
    const products = await Product.getAll();
    return products.find(p => p.id === id);
  }

  static async getAll() {
    return await JsonUpdater.read(filePath);
  }

  static async deleteProduct(id) {
    const allProducts = await Product.getAll();
    const updatedProducts = [...(allProducts.filter(p => p.id !== id) || [])];

    if (updatedProducts) {
      await JsonUpdater.write(filePath, updatedProducts);
      await Cart.deleteProduct(id);
      return true;
    }
    return false;
  }


}

exports.Product = Product;