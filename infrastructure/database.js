const mySql = require("mysql2");

const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  database: "node-db",
  password: "Allah1234"
});

exports.pool = pool.promise();