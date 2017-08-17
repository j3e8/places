let mysql = require('mysql');
let config = require('config');
let creds = config.get('database');
let mysql_con = mysql.createPool(creds);

let db = {};

db.query = function(sql, ...params) {
  return new Promise((resolve, reject) => {
    mysql_con.query(sql, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
db.escape = mysql_con.escape.bind(mysql_con);

module.exports = db;
