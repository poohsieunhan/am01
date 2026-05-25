const express = require("express");
const assetController = require("../../controllers/asset.controller");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get("", asyncHandler(assetController.getAllAssets));
router.get("/:Id", asyncHandler(assetController.getAssetById));
router.post("", asyncHandler(assetController.createAsset));
router.put("/:Id", asyncHandler(assetController.updateAsset));
router.delete("/:Id", asyncHandler(assetController.deleteAsset));

module.exports = router;
