const mySql = require("mysql2");
const { getSettings } = require("../common/setting-helper");
const mySqlSettings = getSettings("my-sql");

const pool = mySql.createPool({
	host: mySqlSettings.host,
	user: mySqlSettings.user,
	database: mySqlSettings.database,
	password: mySqlSettings.password
});

exports.pool = pool.promise();
