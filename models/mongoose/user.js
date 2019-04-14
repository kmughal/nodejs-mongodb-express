const { Schema, model } = require("mongoose");
const { toObjectId } = require("../../infrastructure/mongodb");
const userSchema = new Schema({
	
	email: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		]
	}
});

userSchema.pre("save", next => {
	const currentDate = new Date();
	this.updated_at = currentDate.now;
	next();
});

userSchema.methods.getCart = function() {
	return this.cart;
};

userSchema.methods.clearCart = function() {
	this.cart = { items: [] };
	return this.save();
};

userSchema.methods.deleteProductFromCart = function(productId) {
	const updatedCartItems = this.cart.items.filter(
		i => i.productId.toString() !== productId.toString()
	);
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.addToCart = function(product) {
	if (!this.cart) this.cart = { items: [] };
	const cartProductIndex = this.cart.items.findIndex(
		p => p.productId.toString() === product._id.toString()
	);
	let quantity = 1;
	let updatedCart = this.cart;

	if (cartProductIndex >= 0) {
		this.cart.items[cartProductIndex].quantity =
			this.cart.items[cartProductIndex].quantity + 1;
		updatedCart = this.cart;
	} else {
		updatedCart = {
			items: [
				{
					productId: product._id,
					quantity
				}
			]
		};
	}

	this.cart = updatedCart;
	return this.save();
};

exports.UserModel = model("User", userSchema);
