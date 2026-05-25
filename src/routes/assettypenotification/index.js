const express = require("express");
const assetTypeNotificationController = require("../../controllers/assettypenotification.controller.js");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get(
  "",
  asyncHandler(assetTypeNotificationController.getAllAssetTypeNotifications)
);
router.get(
  "/:Id",
  asyncHandler(assetTypeNotificationController.getAssetTypeNotificationById)
);
router.post(
  "",
  asyncHandler(assetTypeNotificationController.createAssetTypeNotification)
);
router.put(
  "/:Id",
  asyncHandler(assetTypeNotificationController.updateAssetTypeNotification)
);
router.delete(
  "/:Id",
  asyncHandler(assetTypeNotificationController.deleteAssetTypeNotification)
);

module.exports = router;
