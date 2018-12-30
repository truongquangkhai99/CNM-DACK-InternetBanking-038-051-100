var express = require("express");
var customerRepo = require("../repos/customerRepo");

var router = express.Router();

router.get("/customers", (req, res) => {
  customerRepo
    .getCustomers()
    .then(rows => {
      res.status(200).json(rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end("View error log on console");
    });
});

module.exports = router;
