const { getCollection, toObjectId } = require("../../infrastructure/mongodb");
const getOrderCollection = async () => getCollection("orders");

exports.Order = class Order {
	constructor(username, email, userId, orders) {
		this.username = username;
		this.email = email;
		this.userId = userId;
		this.orders = orders;
	}

	async addOrder({items}) {
		const orderCollection = await getOrderCollection();
		return await orderCollection.insertOne({
			username: this.username,
			email: this.email,
			userId: this.userId,
			orders: [...items]
		});
	}

	async getOrderByUserId(userId) {
		const orders = await getOrderCollection();
		var query = { userId: toObjectId(userId) };
		const result = await orders.find(query).toArray();
		return result;
	}
}