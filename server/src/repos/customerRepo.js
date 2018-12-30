var db = require("../fn/mysql-db");

exports.getCustomers = () => {
  const sql = `select f_id as customerId, f_email as email, f_username as name, f_phone as phone from users where f_type = 1`;
  return db.load(sql);
};
