const { ProductModel } = require("../../models/mongoose/product");
const { cookieHelper } = require("../../common/cookie-helper");
const { validationResult } = require("express-validator/check");

class mongooseAdminController {
	static initProduct(req, res, next) {
		var vm = {
			title: "Add new Product",
			path: "add-product",
			activeShop: false,
			activeAddProduct: true,
			oldValues: { title: "", description: "", imageUrl: "", price: 0.0 },
			validationErrors: [],
			errorMessages: []
		};
		res.render("admin/add-product", vm);
	}

	static async addProduct(req, res, next) {
		const { title, description, price } = req.body;
		const imageUrl = req.file.path;
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).render("admin/add-product", {
				title: "Add new Product",
				path: "add-product",
				activeShop: false,
				activeAddProduct: true,
				oldValues: { title, description, imageUrl, price },
				validationErrors: errors.array(),
				errorMessages: errors.array().map(e => e.msg)
			});
		}
		const product = new ProductModel({
			title,
			description,
			price,
			imageUrl,
			userId: req.user /* mongoose will pick up user._id*/
		});

		await product.save();
		res.redirect("/admin/add-product");
	}

	static async editProduct(req, res, next) {
		const { id } = req.params;

		try {
			const product = await ProductModel.findById(id).populate("userId");
		
			if (product) {
				return res.render("product/edit-product", {
					path: "edit-product",
					title: `Edit - ${product.title}`,
					product,
					validationErrors: [],
					errorMessages: []
				});
			} else return res.render("/admin/edit-product");
		} catch (e) {
		 console.log("Shop.SaveProduct failed,Error:", e)
			const error = new Error("Shop.SaveProduct failed,Error:", e);
			error.httpStatusCode = 500;
			next(error);
		}
	}

	static async getProducts(req, res, next) {
		const products = await ProductModel.find({ userId: req.user._id });
		products.map(prod => (prod.id = prod._id));
		res.render("admin/product-list", {
			title: "Admin Products",
			path: "admin-product",
			products
		});
	}

	static async updateProduct(req, res, next) {
		const errors = validationResult(req);
		const { id, title, description, price, imageUrl } = req.body;
		const oldValues = { product: { id, title, description, imageUrl, price } };
	
		if (!errors.isEmpty()) {
			return res.status(422).render("product/edit-product", {
				path: "edit-product",
				title: `Edit - ${title}`,
				...oldValues,
				validationErrors: errors.array(),
				errorMessages: errors.array().map(e => e.msg)
			});
		}

		const product = await ProductModel.findOne({
			_id: id,
			userId: req.user._id
		});
		if (!product) return res.status(405).send("Not allowed to update product");
		product.title = title;
		product.description = description;
		product.price = price;
		product.imageUrl = imageUrl;
		product.save();

		res.status(200).send(`Product updated, ${JSON.stringify(product, 2)}`);
	}

	static async deleteProduct(req, res, next) {
		try {
			const { id } = req.body;
			//const result = await ProductModel.findByIdAndRemove(id);
			const product = await ProductModel.findOne({
				_id: id,
				userId: req.user._id
			});
			if (!product)
				return res.status(405).send("Not allowed to delete product");
			await product.destroy();

			res.redirect("/admin/products");
		} catch (e) {
			console.log("Shop.deleteProduct failed,Error:", e);
			const error = new Error("Shop.deleteProduct failed,Error:", e);
			error.httpStatusCode = 500;
			next(error);
		}
	}
}

exports.mongooseAdminController = mongooseAdminController;
