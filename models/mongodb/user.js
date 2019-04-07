const { getCollection, toObjectId } = require("../../infrastructure/mongodb");
const getUserCollection = async () => getCollection("users");

exports.User = class User {
	constructor(username, email, cart, id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this.id = id;
	}

	async save() {
		const userCollection = getUserCollection();
		await userCollection.insertOne({
			username: this.username,
			email: this.email
		});
	}

	getCart() {
		return this.cart;
	}

	async addToCart(product) {

		if (!this.cart.items) this.cart.items = [];

		const searchedProduct = this.cart.items.find(
			p => String(p._id) === String(product._id)
		);

		const quantity = !searchedProduct || searchedProduct.length === 0
				? 1
				: searchedProduct.quantity + 1;
		product.quantity = quantity;
		const updatedItems = this.cart.items.filter(p => String(p._id) !== String(product._id)) || [];
			 
	
		updatedItems.push(product);
	
		const updatedCart = { items: updatedItems };
		const userCollection = await getUserCollection();
		const result = await userCollection.updateOne(
			{ _id: toObjectId(this.id) },
			{
				$set: {
					cart: updatedCart
				}
			}
		);
		return result;
	}

	static async getById(id) {
		const userCollection = await getUserCollection();
		const result = await userCollection.findOne({ _id: toObjectId(id) });
		return result;
	}

	async removeProductFromCart(userId, id) {
		id = id.toString();
		const updatedCart = this.cart.items.filter(i => i._id.toString() !== id);

		const userCollection = await getUserCollection();
		const query = { _id: toObjectId(userId) };

		return await userCollection.updateOne(query, {
			$set: { cart: updatedCart }
		});
	}
};
