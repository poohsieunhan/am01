const express = require("express");
const accountController = require("../../controllers/account.controller");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(accountController.getAllAccounts));
router.get("/:Id", asyncHandler(accountController.getAccountById));
router.post("", asyncHandler(accountController.createAccount));
router.put("/:Id", asyncHandler(accountController.updateAccount));
router.delete("/:Id", asyncHandler(accountController.deleteAccount));

module.exports = router;
