const Sequelize = require("sequelize");
const {
  sequelize
} = require("../../infrastructure/sequelize-database");

exports.CartModel = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }

});