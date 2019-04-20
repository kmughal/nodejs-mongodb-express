const {
  Sequelize
} = require("sequelize");

const { getSettings } = require("../common/setting-helper");
const mySqlSettings = getSettings("my-sql");

const instance = new Sequelize(mySqlSettings.database, mySqlSettings.user, mySqlSettings.password, {
  dialect: "mysql",
  host: mySqlSettings.host
});

module.exports.sequelize = instance;