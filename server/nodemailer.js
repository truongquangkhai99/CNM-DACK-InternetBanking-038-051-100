var nodemailer = require("nodemailer");

const output = verifyEntity => {
  const { clientName, otp } = verifyEntity;
  return `
    <p>Xin chào <i>${clientName}</i>, </p>
    <p>Bạn cần nhập mã xác nhận bên dưới để hoàn tất giao dịch: </p>
    <p>${otp}</p>
    <p>Chúc công việc thuận lợi,</p>
    <p>Team Banking</p>
  `;
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jenkin.testing@gmail.com",
    pass: "1234@4567"
  }
});

exports.sendMail = verifyEntity => {
  const { clientEmail } = verifyEntity;
  var mailOptions = {
    from: "jenkin.testing@gmail.com",
    to: clientEmail,
    subject: "Xác nhận giao dịch",
    text: "OTP",
    html: output(verifyEntity)
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
