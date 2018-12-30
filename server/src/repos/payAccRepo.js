var db = require("../fn/mysql-db");

exports.add = payAccEntity => {
  const {
    id,
    clientEmail,
    clientName,
    accNumber,
    balance,
    createdAt
  } = payAccEntity;

  const sql =
    "insert into `payAcc`(`id`, `clientEmail`, `clientName`, `accNumber`, `balance`, `createdAt`)" +
    `values('${id}','${clientEmail}','${clientName}','${accNumber}','${balance}', '${createdAt}');`;
  return db.save(sql);
};

exports.loadAll = () => {
  var sql = `select * from payAcc`;
  return db.load(sql);
};