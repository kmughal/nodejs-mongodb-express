const Sequelize = require("sequelize");
const {sequelize} = require("../../infrastructure/sequelize-database");


exports.CartItemModel = sequelize.define("cartItem" , {
  id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    autoIncrement: true,
    primaryKey : true
  },
  qunatity : {
    type : Sequelize.INTEGER,
    allowNull : false
  }
});