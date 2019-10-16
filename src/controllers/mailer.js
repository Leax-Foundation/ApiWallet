const mailer = require("../utils/mailer");

class MailerController {
  constructor() {}

  sendWallet(req, res) {
    mailer
      .sendMailWallet(req.body.email, req.body.wallet)
      .then(res => {
        res.status(200).send("sucess");
      })
      .catch(err => {
        res.status(400).send("err");
      });
  }
}

module.exports = MailerController;
