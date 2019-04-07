const { MongoClient,ObjectID } = require("mongodb");
const fs = require("fs");
const settingFilePath = require("path").resolve(__dirname,"../settings" , "mongo.json");

let url = fs.existsSync(settingFilePath) ?
require(settingFilePath).url: "mongodb://localhost:27017/MyTasks";

let _client;
let _db;
const createMongoClient = async () => {
	if (_client) return _client;
	_client = await MongoClient.connect(url, { useNewUrlParser: true });
	if (!_db) _db = _client.db("test");
};

const getDb = async () => {
	if (!_client) await createMongoClient();
	if (_db) return _db;
	_db = _client.db("test");
	return _db;
};

const getCollection = async collectionName => {
	const db = await getDb();
	const collection = await db.collection(collectionName);
	return collection;
};

const toObjectId = (id) =>{
	return new ObjectID(id);
}

exports.createMongoClient = createMongoClient;
exports.getDb = getDb;
exports.getCollection = getCollection;
exports.toObjectId = toObjectId;
