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

	async addToCart(product) {
		
		const searchedProduct = this.cart.items.find(
			p => String(p._id) === String(product._id)
		);

		const quantity = searchedProduct ? 1 : (searchedProduct.quantity + 1);
		const updatedCart = { items: [{ ...product, quantity: quantity }] };
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
};
