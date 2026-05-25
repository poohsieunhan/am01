const express = require("express");
const assetNotificationController = require("../../controllers/assetnotification.controller");
const asyncHandler = require("../../helpers/asyncHandler.js");
const router = express.Router();

// router.use(apiKey);
// router.use(checkPermission('0000'));

router.get(
  "",
  asyncHandler(assetNotificationController.getAllAssetNotifications)
);
router.get(
  "/:Id",
  asyncHandler(assetNotificationController.getAssetNotificationById)
);
router.post(
  "",
  asyncHandler(assetNotificationController.createAssetNotification)
);
router.put(
  "/:Id",
  asyncHandler(assetNotificationController.updateAssetNotification)
);
router.delete(
  "/:Id",
  asyncHandler(assetNotificationController.deleteAssetNotification)
);

module.exports = router;
