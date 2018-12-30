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

router.get("/payAccs/:customerId", (req, res) => {
  const {customerId} = req.params;

  payAccRepo
    .loadByCustomerId(customerId)
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
  // số dư mặc định là  0
  _payAcc.balance = 0;
  // số tài khoản gồm 8 chữ số
  _payAcc.accNumber = require("rand-token")
    .generator({
      chars: "numeric"
    })
    .generate(8);

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

router.patch("/payAcc/balance", (req, res) => {
  const payAccId = req.body.payAccId;
  // newBalance = số dư cũ + tiền cần nạp;
  const newBalance = req.body.newBalance;

  const payAccEntity = {
    payAccId,
    newBalance
  }

  payAccRepo
    .UpdateBalanceById(payAccEntity)
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



module.exports = router;
