var express = require("express");
var shortid = require("shortid");
var moment = require("moment");
var _ = require("lodash");

var payAccRepo = require("../repos/payAccRepo");

var router = express.Router();

router.get("/payAccs", (req, res) => {
  payAccRepo
    .loadAll()
    .then(rows => {
      res.statusCode = 200;
      // res.json(rows);
      res.send(
        _.sortBy(JSON.parse(JSON.stringify(rows)), [
          function(o) {
            return o.createdAt;
          }
        ]).reverse()
      );
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.post("/payAcc", (req, res) => {
  const _payAcc = req.body;
  _payAcc.id = shortid.generate();
  _payAcc.createdAt = moment().format("YYYY-MM-DD HH:mm");
  payAccRepo
    .add(_payAcc)
    .then(() => {
      res.statusCode = 201;
      res.json(req.body);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.json({
        status: "UNKNOWN_ERROR",
        message: err
      });
    });
});

module.exports = router;
