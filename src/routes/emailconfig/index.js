const express = require("express");
const emailConfigController = require("../../controllers/emailconfig.controller.js");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(emailConfigController.getAllEmailConfigs));
router.get(
  "/:Id",
  asyncHandler(emailConfigController.getEmailConfigById)
);
router.post("", asyncHandler(emailConfigController.createEmailConfig));
router.put("/:Id", asyncHandler(emailConfigController.updateEmailConfig));
router.delete(
  "/:Id",
  asyncHandler(emailConfigController.deleteEmailConfig)
);

module.exports = router;
