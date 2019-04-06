const {sequelize} = require("../../infrastructure/sequelize-database")
const Sequelize = require("sequelize")

const OrderModel = sequelize.define("order" , {
  id : {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey : true
  }
})

exports.OrderModel = OrderModel;