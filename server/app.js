var express = require("express"),
  app = express();

var bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors");

var nodemailer = require("./nodemailer");

// server nodejs START

// Controllers START

// var driverCtrl = require("./src/apiControllers/driverControllers");

var authCtrl = require("./src/apiControllers/authControllers");

// var requestCtrl = require("./src/apiControllers/requestControllers");

var payAccCtrl = require("./src/apiControllers/payAccControllers");

var historyCtrl = require("./src/apiControllers/historyControllers");

var contactCtrl = require("./src/apiControllers/contactControllers");

var userCtrl = require("./src/apiControllers/userControllers");

var customerCtrl = require("./src/apiControllers/customerControllers");

// Controllers END

var verifyAccessToken = require("./src/repos/authRepo").verifyAccessToken;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

app.use("/auth", authCtrl);
app.use("/user", verifyAccessToken, userCtrl);

app.post("/send-otp", (req, res) => {
  const { clientEmail, clientName } = req.body;
  const otp = require("rand-token")
    .generator({
      chars: "numeric"
    })
    .generate(6);

  const verifyEntity = {
    clientEmail,
    clientName,
    otp
  };
  nodemailer.sendMail(verifyEntity);
  res.statusCode = 201;
  res.json({ otp: otp });
});

//app.use("/", requestCtrl);
// app.use("/", verifyAccessToken, requestCtrl);

app.use("/", payAccCtrl);
// app.use("/", verifyAccessToken, payAccCtrl);

app.use("/", historyCtrl);
// app.use("/", verifyAccessToken, historyCtrl);

app.use("/", contactCtrl);
// app.use("/", verifyAccessToken, contactCtrl);

app.use("/", customerCtrl);
// app.use("/", verifyAccessToken, customerCtrl);

//app.use("/driver", driverCtrl);
// app.use("/driver", verifyAccessToken, driverCtrl);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Banking Express is running on port ${PORT}`);
});

// server nodejs END
