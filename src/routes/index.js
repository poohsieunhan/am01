"use strict";

const express = require("express");
const { route } = require("./company");
const router = express.Router();

//router.use('/api/v1', require('./access'))
router.use("/api/v1/company", require("./company"));
//router.use("/api/v1/dashboard", require("./dashboard"));
router.use("/api/v1/assettype", require("./assettype"));
router.use("/api/v1/account", require("./account"));
router.use("/api/v1/assetnotification", require("./assetnotification"));
router.use("/api/v1/assettypenotification", require("./assettypenotification"));
router.use("/api/v1/asset", require("./asset"));
router.use("/api/v1/project", require("./project"));
router.use("/api/v1/emailrecipient", require("./emailrecipient"));
router.use("/api/v1/emailconfig", require("./emailconfig"));

module.exports = router;
