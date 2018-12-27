var db = require("../fn/mysql-db");

// cam-sv start
exports.updateStatus = (newStatus, driverId) => {
  const sql =
    "update driver set status = " +
    `'${newStatus}'` +
    " where driverId=" +
    `'${driverId}';`;
  return db.save(sql);
};

exports.updateReqId = (reqId, driverId) => {
  const sql =
    "update driver set reqId = " +
    `'${reqId}'` +
    " where driverId=" +
    `'${driverId}';`;
  return db.save(sql);
};

exports.updateCoords = (newLat, newLng, driverId) => {
  const sql =
    "update `driver` set `lat` = " +
    `'${newLat}', ` +
    "`lng` = " +
    `'${newLng}' ` +
    "where `driverId`=" +
    `'${driverId}';`;
  return db.save(sql);
};

exports.loadDriverByReqId = reqId => {
  const sql = "select * from driver where driver.reqId = " + `'${reqId}'`;
  return db.save(sql);
};
// cam-sv end

// duy-th start

exports.findDriver = () => {
  const sql = `select driverId, lat, lng from driver where status = 'READY';`;
  return db.load(sql);
};

// duy-th end
