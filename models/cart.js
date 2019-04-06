const {
  JsonUpdater
} = require("../common/json-updater");

const path = require("path");

const filePath = path
  .resolve(__dirname, "../data-store/cart.json");

class Cart {
  constructor() {
    this.products = [];
    this.totalPrice = 0;
  }

  static async getCart() {
    try {
      const cart = await JsonUpdater.read(filePath);
      return cart;
    } catch (e) {
      throw new Error("Cart.getCart failed,error:", e);
    }
  }

  static async deleteProduct(id) {
    const cart = await Cart.getCart();
    const product = cart.products.find(p => p.id === id);
    if (!product) throw new Error("Cart.deleteProdcut failed,can not find ", id,
      " , error:", e);
    const {
      quantity,
      price
    } = product;
    cart.totalPrice -= price * quantity;
    cart.products = cart.products.filter(p => p.id !== id);
    await JsonUpdater.write(filePath, cart);
    return true;
  }

  static async save(product) {
    try {
      
      const cart = await JsonUpdater.read(filePath, new Cart());
      if (cart.products.length === 0) {
        product.quantity = 1;
        cart.products.push(product);
      } else {
        const index = cart.products.findIndex(p => p.id == product.id);
        if (index >= 0) cart.products[index].quantity += 1;
        else {
          product.quantity = 1;
          cart.products.push(product);
        }
      }
      cart.totalPrice += parseFloat(product.price);
      await JsonUpdater.write(filePath, cart);
    } catch (e) {
      throw new Error("Cart.save failed , error:", e);
    }

  }
}

exports.Cart = Cart;