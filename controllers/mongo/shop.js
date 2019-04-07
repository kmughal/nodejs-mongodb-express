
const {Product} = require("../../models/mongodb/product");

const mongodbShopController = {
	getIndex(req, res, next) {
		try {
			res.render("shop/index", {
				title: "Index",
				path: "index"
			});
		} catch (e) {
			throw new Error("Failed:Index , Error :", e)
		}
	},
	async getProducts(req, res, next) {
		const products = await Product.getAll();
		products.map(p => p.id = p._id);
		try {
			res.render("shop/shop-list", {
				title: "Products",
				path: "products",
				products
			});
		} catch (e) {
			throw new Error("Failed:Shop.Product , Error :", e)
		}

	},
	async getProductById(req, res, next) {
		const product = await Product.getById(req.params.id);
		try {
			res.render("product/detail", {
				title: product.title,
				path: "product-detail",
				product
			});
		} catch (e) {
			throw new Error("Failed:Shop.Product , Error :", e)
		}

	},
	async getCart(req, res, next) {

		try {
			const cart = req.user.cart;
			res.render("shop/cart", {
				title: "Product item added successfully!",
				path: "cart",
				cart
			});
		} catch (e) {
			throw new Error("Failed:Cart , Error :", e)
		}
	},
	async addCart(req, res, next) {
		const {
			id
		} = req.body;

		try {
			const product = await Product.getById(id);
			const result = await req.user.addToCart(product);
			res.render("shop/product-added-to-cart", {
				title: "Product item added successfully!" + JSON.stringify(result),
				path: "cart"
			});
		} catch (e) {
			throw new Error("Failed:Cart , Error :", e)
		}
	},
	getOrders(req, res, next) {
		try {
			res.render("shop/orders", {
				title: "Orders",
				path: "orders"
			});
		} catch (e) {
			throw new Error("Failed:Orders , Error :", e)
		}
	},
	getCheckout(req, res, next) {
		try {
			res.render("shop/checkout", {
				title: "Checkout",
				path: "cart"
			});
		} catch (e) {
			throw new Error("Failed:Checkout , Error :", e)
		}
	},
	async createInitialViewModel(req, res, next) {
		try {
			const products = null;
			res.render("shop/shop-list", {
				products,
				title: "Shop Page",
				path: "shop",
				productExists: products.length > 0,
				activeShop: true,
				activeAddProduct: false
			});
		} catch (e) {
			throw new Error("Fail to get products.")
		}
	},
	async removePrdouctFromCart(req, res, next) {
		try {
			const {
				id
			} = req.body;
			const result = null;
			if (result) {
				return res.redirect("/shop/cart");
			}

		} catch (e) {
			throw new Error("Shp.removeProductFromCart failed, Error:", e);
		}

	}
};

module.exports.mongodbShopController = mongodbShopController;