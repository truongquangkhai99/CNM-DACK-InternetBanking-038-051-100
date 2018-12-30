var express = require("express"),
  app = express();

var bodyParser = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors");

// server nodejs START

// Controllers START

var driverCtrl = require("./src/apiControllers/driverControllers");

var authCtrl = require("./src/apiControllers/authControllers");

var requestCtrl = require("./src/apiControllers/requestControllers");

var payAccCtrl = require("./src/apiControllers/payAccControllers");

var userCtrl = require("./src/apiControllers/userControllers");

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

//app.use("/", requestCtrl);
app.use("/", verifyAccessToken, requestCtrl);

// app.use("/", payAccCtrl);
app.use("/", verifyAccessToken, payAccCtrl);

//app.use("/driver", driverCtrl);
app.use("/driver", verifyAccessToken, driverCtrl);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Banking Express is running on port ${PORT}`);
});

// server nodejs END
