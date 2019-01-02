var db = require("../fn/mysql-db");

exports.add = historyEntity => {
  const {
    id,
    payAccId,
    toAccNumber,
    amount,
    feeType,
    createdAt
  } = historyEntity;

  const sql =
    "insert into `history`(`id`, `payAccId`, `toAccNumber`, `amount`, `feeType`, `createdAt`)" +
    `values('${id}', '${payAccId}', '${toAccNumber}','${amount}', '${feeType}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByPayAccId = payAccId => {
  var sql = `select * from history where payAccId = '${payAccId}'`;
  return db.load(sql);
};