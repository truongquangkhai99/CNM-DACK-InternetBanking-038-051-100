var express = require("express");
var _ = require('lodash');

var driverRepo = require("../repos/driverRepo");
var router = express.Router();

router.patch("/status", (req, res) => {
  const driverId = req.body.driverId;
  const newStatus = req.body.status;

  driverRepo
    .updateStatus(newStatus, driverId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.patch("/reqId", (req, res) => {
  const driverId = req.body.driverId;
  const reqId = req.body.reqId;

  driverRepo
    .updateReqId(reqId, driverId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.patch("/coords", (req, res) => {
  const {
    driverId,
    newLat,
    newLng
  } = req.body;

  driverRepo
    .updateCoords(newLat, newLng, driverId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.get("/:reqId", (req, res) => {
  const reqId = req.params.reqId;
  driverRepo
    .loadDriverByReqId(reqId)
    .then(rows => {
      res.statusCode = 200;
      res.json(rows);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

module.exports = router;