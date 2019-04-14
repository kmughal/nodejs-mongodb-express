const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const hb = require("express-handlebars");
const session = require("express-session");
session({
	secret: "foo bar",
	resave: false /* dont save session for every request only if something is changed then do so*/,
	saveUninitialized: false
});
const MongoDbSessionStore = require("connect-mongodb-session")(session);
const { dbUrl } = require("./infrastructure/mongodb");
const store = new MongoDbSessionStore({ uri: dbUrl, collection: "sessions" });
const app = express();

// Orms
// const {
//   UserModel
// } = require("./models/orms/user");
// const {
//   ProductModel
// } = require("./models/orms/product");
// const {
//   CartModel
// } = require("./models/orms/cart");
// const {
//   CartItemModel
// } = require("./models/orms/cart-item");
// const {
//   OrderModel
// } = require("./models/orms/order");
// const {
//   OrderItemModel
// } = require("./models/orms/order-item");

// Middlewares
app.use(
	bodyParser.urlencoded({
		extended: false
	}),
	bodyParser.json(),
	express.static(path.resolve(__dirname, "public")),
	session({
		secret: "foo bar",
		resave: false /* dont save session for every request only if something is changed then do so*/,
		saveUninitialized: false,
		store:store
	})
);

//const { User } = require("./models/mongodb/user");
// app.use(codeToRmove);
// async function codeToRmove(req, res, next) {
// 	const user = await User.getById("5ca8eb0d1c9d440000f807b5");
// 	req.user = new User(user.username, user.email, user.cart, user._id);
// 	next();
// }
// Set View Engine
// app.set("view engine" , "pug");
// app.engine("hbs",hb({layoutsDir:"views/layouts" , defaultLayout: "main-layout.hbs"}));
// app.set("view engine" , "hbs");
app.set("view engine", "ejs");

// Routes
// Mongodb client
//const { createMongoClient } = require("./infrastructure/mongodb");
const mongoose = require("mongoose");
const { UserModel } = require("./models/mongoose/user");

app.use(async (req, res, next) => {
	if(!req.session.user) return next();
	let user = await UserModel.findById(req.session.user._id);
	if (!user) {
		user = new UserModel({
			password: "123",
			email: "test@gmail.com",
			cart: { items: [] }
		});
		user.save();
	}

	req.user = user;
	return next();
});
const adminRoutes = require("./routers/admin");
const shopRoutes = require("./routers/shop");
const { get404 } = require("./controllers/not-found");
const { authRoutes } = require("./routers/auth");

app.use("/admin", adminRoutes.router);
app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);
app.use(get404);

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

// Express Js server
const http = require("http");
const server = http.createServer(app);

// Sequelizer
// ProductModel.belongsTo(UserModel);
// UserModel.hasMany(ProductModel);
// UserModel.hasOne(CartModel);
// CartModel.belongsTo(UserModel);
// CartModel.belongsToMany(ProductModel, {
//   through: CartItemModel
// });
// ProductModel.belongsToMany(CartModel, {
//   through: CartItemModel
// });
// OrderModel.belongsTo(UserModel);
// UserModel.hasMany(OrderModel);
// OrderModel.belongsToMany(ProductModel, {
//   through: OrderItemModel
// });

// const {
//   sequelize
// } = require("./infrastructure/sequelize-database");

server.listen(3000, async () => {
	console.log("connected!", new Date());
	await mongoose.connect(dbUrl, { useNewUrlParser: true });

	// Mongo db
	//await createMongoClient();
	// await sequelize.sync();
	// .sync({
	//   force: true
	// });
	// const user = await UserModel.findByPk(1);
	// if (!user) {
	//   UserModel.create({
	//     username: "khurram",
	//     password: "123"
	//   })
	//}
	// const cart = await user.getCart();
	// if (!cart) user.createCart();
	// const prods = await cart.getProducts();
	// console.log("pods", prods)
});
