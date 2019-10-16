const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/leax.io/privkey.pem",
//   "utf8"
// );

// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/leax.io/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync("/etc/letsencrypt/live/leax.io/chain.pem", "utf8");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

const app = express();
const cors = require("cors");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use("/api", routes);

module.exports = app;
