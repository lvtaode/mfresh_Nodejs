const mysql = require('mysql');

let pool = mysql.createPool({
  "host":"127.0.0.1",
  "user":"root",
  "database":"mfresh",
  "port":3302,
  "connetionLimit":12
});

module.exports = pool;