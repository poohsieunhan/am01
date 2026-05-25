const {
  AssetNotification: AssetNotificationModel,
  Asset: AssetModel,
} = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AssetNotificationService {
  // Tạo mới 1 AssetNotification
  static async createAssetNotification(data) {
    const _assetId = data.AssetId;
    const existingAssetIdNoti = await AssetNotificationModel.findOne({
      where: { AssetId: _assetId },
    });
    if (existingAssetIdNoti) {
      throw new ErrorResponse(
        "AssetNotification with this AssetId already exists."
      );
    }

    const assetNotification = await AssetNotificationModel.create(data);
    return assetNotification;
  }

  // Lấy danh sách AssetNotification
  static async getAllAssetNotifications({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await AssetNotificationModel.findAndCountAll({
      offset,
      limit,
      order: [["Id", "DESC"]],
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // Lấy detail 1 Account theo Id
  static async getAssetNotificationById(id) {
    const assetNotification = await AssetNotificationModel.findByPk(id);
    return assetNotification; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 AssetNotification
  static async updateAssetNotification(id, data) {
    //console.log('UpdateAssetNotification - data:', data);
    const assetNotification = await AssetNotificationModel.findByPk(id);
    if (!assetNotification) {
      return null;
    }

    await assetNotification.update(data);
    return assetNotification;
  }

  // Xóa 1 AssetNotification
  static async deleteAssetNotification(id) {
    const assetNotification = await AssetNotificationModel.findByPk(id);

    const foundAsset = await AssetModel.count({
      where: { AssetNotificationId: id },
    });
    if (foundAsset > 0)
      throw new ErrorResponse(
        "AssetNotification đã tồn tại trong Asset. Không thể xóa!"
      );

    if (!assetNotification) {
      return null;
    }

    await assetNotification.destroy();
    return true;
  }
}

module.exports = AssetNotificationService;
