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
    message,
    createdAt
  } = historyEntity;

  const sql =
    "insert into `history`(`id`, `payAccId`, `fromAccNumber`, `toAccNumber`, `amount`, `feeType`, `transactionType`, `message`, `createdAt`)" +
    `values('${id}', '${payAccId}', '${fromAccNumber}', '${toAccNumber}','${amount}', '${feeType}', '${transactionType}', '${message}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadByPayAccId = payAccId => {
  var sql = `select * from history where payAccId = '${payAccId}'`;
  return db.load(sql);
};