const path = require("path")
const express = require("express");
const bodyParser = require("body-parser");
// const hb = require("express-handlebars");

const app = express();

// Orms
const {
  UserModel
} = require("./models/orms/user");
const {
  ProductModel
} = require("./models/orms/product");
const {
  CartModel
} = require("./models/orms/cart");
const {
  CartItemModel
} = require("./models/orms/cart-item");
const {
  OrderModel
} = require("./models/orms/order");
const {
  OrderItemModel
} = require("./models/orms/order-item");
// Middlewares
app.use(
  bodyParser.urlencoded({
    extended: false
  }),
  bodyParser.json(),
  express.static(path.resolve(__dirname, "public")));


app.use(codeToRmove)
async function codeToRmove(req, res, next) {
  
  console.log("in middleware")
  const user = await UserModel.findByPk(1);
  req.user = user;
  next();
}
// Set View Engine
// app.set("view engine" , "pug");
// app.engine("hbs",hb({layoutsDir:"views/layouts" , defaultLayout: "main-layout.hbs"}));
// app.set("view engine" , "hbs");
app.set("view engine", "ejs");

// Routes 
const adminRoutes = require("./routers/admin");
const shopRoutes = require("./routers/shop");
const {
  get404
} = require("./controllers/not-found");
app.use("/admin", adminRoutes.router);
app.use("/shop", shopRoutes);
app.use(get404);



//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

// Express Js server
const http = require("http");
const server = http.createServer(app);

// Sequelizer sync!


ProductModel.belongsTo(UserModel);
UserModel.hasMany(ProductModel);
UserModel.hasOne(CartModel);
CartModel.belongsTo(UserModel);
CartModel.belongsToMany(ProductModel, {
  through: CartItemModel
});
ProductModel.belongsToMany(CartModel, {
  through: CartItemModel
});
OrderModel.belongsTo(UserModel);
UserModel.hasMany(OrderModel);
OrderModel.belongsToMany(ProductModel, {
  through: OrderItemModel
});

const {
  sequelize
} = require("./infrastructure/sequelize-database");

server.listen(3000, async () => {
  console.log("connected!", new Date());
  await sequelize.sync();
  // .sync({
  //   force: true
  // });
  const user = await UserModel.findByPk(1);
  if (!user) {
    UserModel.create({
      username: "khurram",
      password: "123"
    })
  }
  const cart = await user.getCart();
  if (!cart) user.createCart();
  const prods = await cart.getProducts();
  console.log("pods", prods)
});