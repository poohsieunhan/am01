const assetTypeService = require("../services/assettype.service");
const { SuccessResponse } = require("../core/success.response");

class AssetTypeController {
  createAssetType = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateAssetType - HEADERS:', req.headers);
      // console.log('CreateAssetType - RAW_BODY:', req.rawBody);
      // console.log('CreateAssetType - BODY:', inputData);
      new SuccessResponse({
        message: "Asset Type created successfully",
        metadata: await assetTypeService.createAssetType(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllAssetTypes = async (req, res, next) => {
    const { page, limit, search } = req.query;
    new SuccessResponse({
      message: "Asset Types retrieved successfully",
      metadata: await assetTypeService.getAllAssetTypes({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
      }),
    }).send(res);
  };

  getAssetTypeById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const assetType = await assetTypeService.getAssetTypeById(Id);
    new SuccessResponse({
      message: "Asset Type retrieved successfully",
      metadata: assetType,
    }).send(res);
  };

  updateAssetType = async (req, res, next) => {
    const { Id } = req.params;
    const updatedAssetType = await assetTypeService.updateAssetType(
      Id,
      req.body
    );
    new SuccessResponse({
      message: "Asset Type updated successfully",
      metadata: updatedAssetType,
    }).send(res);
  };

  deleteAssetType = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await assetTypeService.deleteAssetType(Id);
      new SuccessResponse({
        message: "Asset Type deleted successfully",
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

module.exports = new AssetTypeController();
