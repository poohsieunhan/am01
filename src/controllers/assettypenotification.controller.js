const assetTypeNotificationService = require("../services/assettypenotification.service");
const { SuccessResponse } = require("../core/success.response");

class AssetTypeNotificationController {
  createAssetTypeNotification = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateAssetTypeNotification - HEADERS:', req.headers);
      // console.log('CreateAssetTypeNotification - RAW_BODY:', req.rawBody);
      // console.log('CreateAssetTypeNotification - BODY:', inputData);
      new SuccessResponse({
        message: "AssetTypeNotification created successfully",
        metadata:
          await assetTypeNotificationService.createAssetTypeNotification(
            req.body
          ),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllAssetTypeNotifications = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "AssetTypeNotifications retrieved successfully",
      metadata: await assetTypeNotificationService.getAllAssetTypeNotifications(
        {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
        }
      ),
    }).send(res);
  };

  getAssetTypeNotificationById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const assetTypeNotification =
      await assetTypeNotificationService.getAssetTypeNotificationById(Id);
    new SuccessResponse({
      message: "AssetTypeNotification retrieved successfully",
      metadata: assetTypeNotification,
    }).send(res);
  };

  updateAssetTypeNotification = async (req, res, next) => {
    const { Id } = req.params;
    const updatedAssetTypeNotification =
      await assetTypeNotificationService.updateAssetTypeNotification(
        Id,
        req.body
      );
    new SuccessResponse({
      message: "AssetTypeNotification updated successfully",
      metadata: updatedAssetTypeNotification,
    }).send(res);
  };

  deleteAssetTypeNotification = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await assetTypeNotificationService.deleteAssetTypeNotification(Id);
      new SuccessResponse({
        message: "AssetTypeNotification deleted successfully",
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };
}

module.exports = new AssetTypeNotificationController();
