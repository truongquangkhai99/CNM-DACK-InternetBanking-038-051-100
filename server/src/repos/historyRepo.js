var db = require("../fn/mysql-db");

exports.add = historyEntity => {
  const {
    id,
    payAccId,
    fromAccNumber,
    toAccNumber,
    amount,
    feeType,
    transactionType,
    createdAt
  } = historyEntity;

  const sql =
    "insert into `history`(`id`, `payAccId`, `fromAccNumber`, `toAccNumber`, `amount`, `feeType`, `transactionType`, `createdAt`)" +
    `values('${id}', '${payAccId}', '${fromAccNumber}', '${toAccNumber}','${amount}', '${feeType}', '${transactionType}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByPayAccId = payAccId => {
  var sql = `select * from history where payAccId = '${payAccId}'`;
  return db.load(sql);
};