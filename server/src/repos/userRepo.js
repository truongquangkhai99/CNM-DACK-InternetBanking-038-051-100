var md5 = require("crypto-js/md5");
var uid = require("rand-token").uid;
var db = require("../fn/mysql-db");

exports.getDriverInfo = driverId => {
  const sql = `select f_name as name, f_phone as phone from users where \`f_id\`="${driverId}" and \`f_type\`=4`;

  return db.load(sql);
};
