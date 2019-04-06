const Sequelize = require("sequelize");
const {sequelize} = require("../../infrastructure/sequelize-database");


exports.OrderItemModel = sequelize.define("orderItem" , {
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