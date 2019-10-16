const express = require("express");
const SeedController = require("../controllers/seed");

const router = express.Router();
const seedController = new SeedController();


router.get('/:point', (req, res) => seedController.generate(req, res)); //ok
router.post('/showSeed', (req, res) => seedController.showSeed(req, res));

module.exports = router;    