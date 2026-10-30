const express = require("express");
const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

router.post("/login", asyncHandler(userController.login));
router.get("", asyncHandler(userController.getAllUsers));
router.get("/:Id", asyncHandler(userController.getUserById));
router.post("", asyncHandler(userController.createUser));
router.put("/:Id", asyncHandler(userController.updateUser));
router.delete("/:Id", asyncHandler(userController.deleteUser));

module.exports = router;
