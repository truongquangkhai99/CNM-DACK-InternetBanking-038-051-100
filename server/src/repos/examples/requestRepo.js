var db = require("../fn/mysql-db");


exports.add = requestEntity => {
  const {
    id,
    clientName,
    phone,
    address,
    date_submitted,
    note,
    status: statusReq,
    lat,
    lng
  } = requestEntity;

  const sql =
    "insert into `request`(`id`, `clientName`, `phone`, `address`, `date_submitted`, `note`, `status`, `lat`, `lng`)" +
    `values('${id}','${clientName}','${phone}','${address}', '${date_submitted}','${note}','${statusReq}',${lat},${lng});`;
  return db.save(sql);
};

exports.loadAll = () => {
  var sql = `select * from request`;
  return db.load(sql);
};

// duy-th start
exports.updateCoords = (newLat, newLng, reqId) => {
  const sql =
    "update `request` set `lat` = " +
    `'${newLat}', ` +
    "`lng` = " +
    `'${newLng}' ` +
    "where `id`=" +
    `'${reqId}';`;
  return db.save(sql);
};

exports.getCoords = reqId => {
  const sql =
    "select `lat`, `lng` from `request` where `id` = " + `'${reqId}';`;
  return db.load(sql);
};

exports.loadReqByStatus = (status) => {
  const sql = "select * from request where status = " + `'${status}'`;
  return db.load(sql);
};

exports.loadUnidenAndIden = () => {
  const status1 = 'UNIDENTIFIED';
  const status2 = 'IDENTIFIED';
  const sql = "select * from request where status = " + `'${status1}'` + "or status = " + `'${status2}'`;
  return db.load(sql);
};
// duy-th end

// cam-sv start
exports.updateStatus = (newStatus, reqId) => {
  const sql =
    "update request set status = " + `'${newStatus}'` + " where id=" + `'${reqId}';`;
  return db.save(sql);
};
// cam-sv end

exports.updateDriverId = (driverId, reqId) => {
  const sql =
    "update request set driverId = " + `'${driverId}'` + " where id=" + `'${reqId}';`;
  return db.save(sql);
};