const assetNotificationService = require("../services/assetnotification.service");
const { SuccessResponse } = require("../core/success.response");

class AssetNotificationController {
  createAssetNotification = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateAssetNotification - HEADERS:', req.headers);
      // console.log('CreateAssetNotification - RAW_BODY:', req.rawBody);
      // console.log('CreateAssetNotification - BODY:', inputData);
      new SuccessResponse({
        message: "AssetNotification created successfully",
        metadata: await assetNotificationService.createAssetNotification(
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

  getAllAssetNotifications = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "AssetNotifications retrieved successfully",
      metadata: await assetNotificationService.getAllAssetNotifications({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    }).send(res);
  };

  getAssetNotificationById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const assetNotification =
      await assetNotificationService.getAssetNotificationById(Id);
    new SuccessResponse({
      message: "AssetNotification retrieved successfully",
      metadata: assetNotification,
    }).send(res);
  };

  updateAssetNotification = async (req, res, next) => {
    const { Id } = req.params;
    const updatedAssetNotification =
      await assetNotificationService.updateAssetNotification(Id, req.body);
    new SuccessResponse({
      message: "AssetNotification updated successfully",
      metadata: updatedAssetNotification,
    }).send(res);
  };

  deleteAssetNotification = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await assetNotificationService.deleteAssetNotification(Id);
      new SuccessResponse({
        message: "AssetNotification deleted successfully",
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

module.exports = new AssetNotificationController();
