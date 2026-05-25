const express = require("express");
const emailRecipientController = require("../../controllers/emailrecipient.controller.js");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(emailRecipientController.getAllEmailRecipients));
router.get(
  "/:Id",
  asyncHandler(emailRecipientController.getEmailRecipientById)
);
router.post("", asyncHandler(emailRecipientController.createEmailRecipient));
router.put("/:Id", asyncHandler(emailRecipientController.updateEmailRecipient));
router.delete(
  "/:Id",
  asyncHandler(emailRecipientController.deleteEmailRecipient)
);

module.exports = router;
