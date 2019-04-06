const {
  Sequelize
} = require("sequelize");

const instance = new Sequelize("node-db", "root", "Allah1234", {
  dialect: "mysql",
  host: "localhost"
});

module.exports.sequelize = instance;