var express = require("express");
var uid = require("rand-token").uid;
var userRepo = require("../repos/userRepo");

var router = express.Router();

router.post("/me", (req, res) => {
  let payload = req.token_payload;
  console.log(req.token_payload);
  res.json({
    info: {
      name: payload.user.f_name,
      phone: payload.user.f_phone,
      type: payload.user.f_type
    }
  });
});

router.post("/id", (req, res) => {
  let payload = req.token_payload;
  res.json({
    id: payload.user.f_id
  });
});

router.get("/driver/:driverId", (req, res) => {
  const driverId = req.params.driverId;
  userRepo
    .getDriverInfo(driverId)
    .then(rows => {
      res.status(200).json(rows[0]);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end("View error log on console");
    });
});

module.exports = router;
