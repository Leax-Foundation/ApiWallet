const express = require("express");
const Erc20Controller = require("../controllers/erc20");

const router = express.Router();
const erc20Controller = new Erc20Controller();

router.post('/', (req, res) => erc20Controller.create(req, res)); //ok
router.post('/privateKey', (req, res) => erc20Controller.exportPrivateKey(req, res)); //ok
router.post('/login/json', (req, res) => erc20Controller.loginWithJson(req, res)); //ok
router.post('/login/seed', (req, res) => erc20Controller.loginWithSeed(req, res)); //ok
router.post('/token/balance', (req, res) => erc20Controller.getTokenBalance(req, res)); //ok
router.post('/token/send', (req, res) => erc20Controller.sendToken(req, res)); //ok
router.post('/eth/balance', (req, res) => erc20Controller.getEthBalance(req, res)); //ok
router.post('/eth/send', (req, res) => erc20Controller.sendEth(req, res)); //ok
router.post('/recovery/seed', (req, res) => erc20Controller.recoverySeed(req, res)); //ok
router.post('/recovery/getAddress', (req, res) => erc20Controller.checksumAddress(req, res)); //ok
router.get('/transaction/:address', (req, res) => erc20Controller.getTransactions(req, res)); //ok

module.exports = router;