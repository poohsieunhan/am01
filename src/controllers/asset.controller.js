const assetService = require("../services/asset.service");
const { SuccessResponse } = require("../core/success.response");

class AssetController {
  createAsset = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateAsset - HEADERS:', req.headers);
      // console.log('CreateAsset - RAW_BODY:', req.rawBody);
      // console.log('CreateAsset - BODY:', inputData);
      new SuccessResponse({
        message: "Asset created successfully",
        metadata: await assetService.createAsset(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getExpiringAssets = async (req, res, next) => {
    const { days, page, limit, type, search } = req.query;
    new SuccessResponse({
      message: "Expiring assets retrieved successfully",
      metadata: await assetService.getExpiringAssets({
        days: Number(days) || 30,
        page: Number(page) || 1,
        limit: Number(limit) || 50,
        type: type || "expiring",
        search: search || "",
      }),
    }).send(res);
  };

  sendNotificationMail = async (req, res, next) => {
    try {
      const { type, days } = req.body;
      const { scanAndSendExpiredAssets } = require("../services/cronMail.service");
      const result = await scanAndSendExpiredAssets({
        type: type || "expiring",
        days: days ? Number(days) : undefined,
      });

      new SuccessResponse({
        message: result.message || "Gửi email thông báo thành công",
        metadata: result,
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status: "error",
        message: error.message || "Gặp lỗi khi gửi email thông báo",
      });
    }
  };

  getAllAssets = async (req, res, next) => {
    const { page, limit, search } = req.query;
    new SuccessResponse({
      message: "Assets retrieved successfully",
      metadata: await assetService.getAllAssets({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
      }),
    }).send(res);
  };

  getAssetById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const asset = await assetService.getAssetById(Id);
    new SuccessResponse({
      message: "Asset retrieved successfully",
      metadata: asset,
    }).send(res);
  };

  updateAsset = async (req, res, next) => {
    const { Id } = req.params;
    const updatedAsset = await assetService.updateAsset(Id, req.body);
    new SuccessResponse({
      message: "Asset updated successfully",
      metadata: updatedAsset,
    }).send(res);
  };

  deleteAsset = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await assetService.deleteAsset(Id);
      new SuccessResponse({
        message: "Asset deleted successfully",
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

module.exports = new AssetController();
