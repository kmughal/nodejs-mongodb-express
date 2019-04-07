const { Product } = require("../../models/mongodb/product");

class mongodbAdminController {
	static initProduct(req, res, next) {
		var vm = {
			title: "Add new Product",
			path: "add-product",
			activeShop: false,
			activeAddProduct: true
		};
		res.render("admin/add-product", vm);
	}

	static async addProduct(req, res, next) {
    const { title, description, imageUrl, price } = req.body;
    
		const product = new Product(
			title,
			description,
			price,
			imageUrl,
			req.user._id
		);
		await product.save();
		res.redirect("/admin/add-product");
	}

	static async editProduct(req, res, next) {
		const { id } = req.params;

		try {
			const product = await Product.getById(id);
			if (product) {
				return res.render("product/edit-product", {
					path: "edit-product",
					title: `Edit - ${product.title}`,
					product
				});
			} else return res.render("/admin/edit-product");
		} catch (e) {
			throw new Error("Fail to save product");
		}
	}

	static async getProducts(req, res, next) {
		const products = await Product.getAll();
		products.map(prod => (prod.id = prod._id));
		res.render("admin/product-list", {
			title: "Admin Products",
			path: "admin-product",
			products
		});
	}

	static async updateProduct(req, res, next) {
		const { id, title, description, price, imageUrl } = req.body;
		const product = await Product.update(
			id,
			title,
			description,
			price,
			imageUrl
		);
		res.status(200).send(`Product updated, ${JSON.stringify(product, 2)}`);
	}

	static async deleteProduct(req, res, next) {
		try {
			const { id } = req.body;
			const result = Product.delete(id);
			if (!result) throw new Error("Fail to delete the product");
			res.redirect("/admin/products");
		} catch (e) {
			throw new Error("Shop.deleteProduct failed,Error:", e);
		}
	}
}

exports.mongodbAdminController = mongodbAdminController;
