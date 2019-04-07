const { getCollection, toObjectId } = require("../../infrastructure/mongodb");

const getProductCollection = async () => await getCollection("products");

exports.Product = class Product {
	constructor(title, description, price, imageUrl,userId) {
		this.title = title;
		this.description = description;
		this.price = price;
    this.imageUrl = imageUrl;
    this.userId = userId;
	}

	async save() {
		try {
			const collection = await getProductCollection();
			collection
				.insertOne({
					title: this.title,
					description: this.description,
					price: this.price,
          imageUrl: this.imageUrl,
          userId : this.userId
				})
				.then(v => console.log(v))
				.catch(e => console.log("e:", e));
			console.log(collection);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	static async delete(id) {
		const collection = await getProductCollection();
		const query = { _id: toObjectId(id) };
		const result = await collection.deleteOne(query);
	}
	static async update(id, title, description, price, imageUrl) {
		const collection = await getProductCollection();

		await collection.updateOne(
			{ _id: toObjectId(id) },
			{
				$set: {
					title,
					description,
					price,
					imageUrl
				}
			},
			{ upsert: true }
		);
		return Product.getById(id);
	}

	static async getById(id) {
		try {
			const collection = await getProductCollection();
			const result = await collection.findOne({ _id: toObjectId(id) });
			if (result) result.id = result._id;
			return result;
		} catch (e) {
			console.log("Product.get error, e:", e);
			throw e;
		}
	}

	static async getAll() {
		const collection = await getProductCollection();
		const result = await collection.find({}).toArray();
		return result;
	}
};
