const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
	products: [
		{
			product: { type: Object, required: true },
			quantity: { type: Number, required: true }
		}
	],
	user: {
		email: { type: String, required: true },
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		}
	}
});

orderSchema.methods.createOrder = function(userId, username, email, products) {
	this.userId = userId;
	this.products = products;
	this.email = email;
	this.username = username;
	return this.save();
};

exports.OrderModel = model("Order", orderSchema);
