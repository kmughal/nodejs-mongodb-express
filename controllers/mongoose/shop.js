const { cookieHelper } = require("../../common/cookie-helper");

const { ProductModel } = require("../../models/mongoose/product");
const { OrderModel } = require("../../models/mongoose/order");

const mongoosedbShopController = {
	getIndex(req, res, next) {
		try {
			res.render("shop/index", {
				title: "Index",
				path: "index",
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Index , Error :", e);
		}
	},
	async getProducts(req, res, next) {
		const products = await ProductModel.find().populate("product");
		products.map(p => (p.id = p._id));
		try {
			res.render("shop/shop-list", {
				title: "Products",
				path: "products",
				products,
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Shop.Product , Error :", e);
		}
	},
	async getProductById(req, res, next) {
		const product = await ProductModel.findById(req.params.id).populate(
			"product"
		);
		try {
			res.render("product/detail", {
				title: product.title,
				path: "product-detail",
				product,
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Shop.Product , Error :", e);
		}
	},
	async getCart(req, res, next) {
		try {
			const { cart } = await req.user
				.populate("cart.items.productId")
				.execPopulate();
			res.render("shop/cart", {
				title: "Product item added successfully!",
				path: "cart",
				cart,
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Cart , Error :", e);
		}
	},
	async addCart(req, res, next) {
		const { id } = req.body;

		try {
			const product = await ProductModel.findById(id);
			await req.user.addToCart(product);
			res.render("shop/product-added-to-cart", {
				title: "Product item added successfully!",
				path: "cart",
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Cart , Error :", e);
		}
	},

	async getOrders(req, res, next) {
		try {
			const orders = await OrderModel.find({
				"user.userId": req.user
			}).populate("product");
			const data = orders.map(order => ({
				orderId: order._id,
				products: order.products
			}));
			data.username = orders[0].user.name;
			data.email = orders[0].user.email;
			res.render("shop/orders", {
				title: "Orders",
				path: "orders",
				data,
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Orders , Error :", e);
		}
	},
	getCheckout(req, res, next) {
		try {
			res.render("shop/checkout", {
				title: "Checkout",
				path: "cart",
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Failed:Checkout , Error :", e);
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
				activeAddProduct: false,
				isAuthenticated: req.session.isAuthenticated
			});
		} catch (e) {
			throw new Error("Fail to get products.");
		}
	},
	async removePrdouctFromCart(req, res, next) {
		try {
			const { id } = req.body;

			const result = await req.user.deleteProductFromCart(id);

			if (result) {
				return res.redirect("/shop/cart");
			}
		} catch (e) {
			throw new Error("Shp.removeProductFromCart failed, Error:", e);
		}
	},
	async createOrder(req, res, hext) {
		const { username, email } = req.user;

		const { cart } = await req.user
			.populate("cart.items.productId")
			.execPopulate();
		const products = cart.items.map(i => ({
			quantity: i.quantity,
			product: { ...i.productId._doc }
		}));

		const order = new OrderModel({
			user: { name: username, email, userId: req.user },
			products
		});

		const result = await order.save();
		if (result) {
			await req.user.clearCart();
			return res.redirect("/shop/orders");
		}
	}
};

module.exports.mongoosedbShopController = mongoosedbShopController;
