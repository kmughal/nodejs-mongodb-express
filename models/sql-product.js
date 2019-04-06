const {
  pool
} = require("../infrastructure/database");

class SqlProduct {

  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  static async update(product) {
    try {

      await pool.execute(`Update Product Set title=? , description=?,price=?,imageUrl=? WHERE id=?`, [
        product.title, product.description, product.price, product.imageUrl, product.id
      ]);

    } catch (e) {
      throw new Error("Product.update failed,error:", e)
    }
  }

  async save() {
    try {
      await pool.execute("insert INTO Product (title,description,price,imageUrl) VALUES (?,?,?,?);",
        [this.title, this.description, this.price, this.imageUrl]);
    } catch (e) {
      throw new Error("Fail: Save product,e:", e);
    }
  }

  static async getProductById(id) {
    const [results] = await pool.query("SELECT * FROM Product where id=?;", [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async getAll() {
    const [results] = await pool.query("SELECT * FROM Product;");
    return results;
  }

  static async deleteProduct(id) {
    await pool.query("delete from Product where id=?", [id]).then(v => v).catch(e => console.log("e:", e))
  }

}

exports.SqlProduct = SqlProduct;