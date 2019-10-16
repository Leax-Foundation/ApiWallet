const express = require("express");
const MailerController = require("../controllers/mailer");

const router = express.Router();
const seedController = new MailerController();

router.get('/wallet', (req, res) => seedController.sendWallet(req, res));

module.exports = router;