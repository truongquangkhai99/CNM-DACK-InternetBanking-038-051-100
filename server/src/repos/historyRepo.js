var db = require("../fn/mysql-db");

exports.add = historyEntity => {
  const {
    id,
    customerId,
    toAccNumber,
    amount,
    createdAt
  } = historyEntity;

  const sql =
    "insert into `history`(`id`, `customerId`, `toAccNumber`, `amount`, `createdAt`)" +
    `values('${id}', '${customerId}', '${toAccNumber}','${amount}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByCustomerId = customerId => {
  var sql = `select * from history where customerId = '${customerId}'`;
  return db.load(sql);
};