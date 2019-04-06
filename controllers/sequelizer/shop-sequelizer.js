const {
	ProductModel
} = require("../../models/orms/product");


const shopSequelizerController = {
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
		const products = await ProductModel.findAll();
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
		const product = await ProductModel.findByPk(req.params.id);
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
			const cart = await req.user.getCart();
			console.log("cart", cart);
			const products = await cart.getProducts();

			res.render("shop/cart", {
				title: "Product item added successfully!",
				path: "cart",
				cart: {
					products: products
				}
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
			const product = await ProductModel.findByPk(id);
			const cart = await req.user.getCart();
			const productFetched = await cart.getProducts({
				where: {
					id: 1
				}
			});
			let qty = 1;
			if (productFetched.length) {
				qty = productFetched[0].cartItem.qunatity + 1;
			}
			await cart.addProducts(product, {
				through: {
					qunatity: qty
				}
			});
			res.render("shop/product-added-to-cart", {
				title: "Product item added successfully!",
				path: "cart"
			});
		} catch (e) {
			throw new Error("Failed:Cart , Error :", e)
		}
	},
	async getOrders(req, res, next) {
		try {
			
			const orders = await req.user.getOrders({include : ["products"]});
			res.render("shop/orders", {
				title: "Orders",
				path: "orders",
				orders
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
			const products = await Product.getAll();
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
			const cart = await req.user.getCart();

			if (!cart) throw new Error("Cart not found!");
			const products = await cart.getProducts({
				where: {
					id
				}
			});
			if (!products || products.length === 0) throw new Error("Prodcut not found");

			const product = products[0];
			await product.cartItem.destroy();
			res.redirect("/shop/cart");

		} catch (e) {
			throw new Error("Shp.removeProductFromCart failed, Error:", e);
		}

	},
	async createOrder(req, res, next) {
		const cart = await req.user.getCart();
		const products = await cart.getProducts();
		const order = await req.user.createOrder();
		const productOrders = products.map(p => {
			p.orderItem = {
				qunatity: p.cartItem.qunatity
			};
			return p;
		});
		await order.addProducts(productOrders);
		await cart.setProducts(null);
		res.redirect("shop/orders");
	}
};

module.exports.shopSequelizerController = shopSequelizerController;