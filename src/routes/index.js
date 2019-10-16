const express = require("express");
const router = express.Router();

const seedRoute = require('./seed');
const erc20Route = require('./erc20');
const mailerRoute = require('./mailer');

router.use('/seed', seedRoute);
router.use('/erc20', erc20Route);
router.use('/mailer', mailerRoute);

module.exports = router;
