const express = require("express");
const assetTypeController = require("../../controllers/assettype.controller");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(assetTypeController.getAllAssetTypes));
router.get("/:Id", asyncHandler(assetTypeController.getAssetTypeById));
router.post("", asyncHandler(assetTypeController.createAssetType));
router.put("/:Id", asyncHandler(assetTypeController.updateAssetType));
router.delete("/:Id", asyncHandler(assetTypeController.deleteAssetType));
module.exports = router;
