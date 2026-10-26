const {
  AssetTypeNotification: AssetTypeNotificationModel,
  AssetType: AssetTypeModel,
  Asset: AssetModel,
} = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AssetTypeNotificationService {
  // Tạo mới 1 AssetTypeNotification
  static async createAssetTypeNotification(data) {
    const _assetTypeId = data.AssetTypeId;
    const existingAssetTypeNoti = await AssetTypeNotificationModel.findOne({
      where: { AssetTypeId: _assetTypeId },
    });
    if (existingAssetTypeNoti) {
      throw new ErrorResponse(
        "AssetTypeNotification with this AssetTypeId already exists."
      );
    }

    const assetTypeNotification = await AssetTypeNotificationModel.create(data);
    return assetTypeNotification;
  }

  // Lấy danh sách AssetTypeNotification
  static async getAllAssetTypeNotifications({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await AssetTypeNotificationModel.findAndCountAll({
      offset,
      limit,
      order: [["Id", "DESC"]],
      include: [
        {
          model: AssetTypeModel,
          as: "assetType",
          attributes: ["Id", "Code", "Name"],
        },
      ],
      distinct: true,
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
  static async getAssetTypeNotificationById(id) {
    const assetTypeNotification = await AssetTypeNotificationModel.findByPk(
      id,
      {
        include: [
          {
            model: AssetTypeModel,
            as: "assetType",
            attributes: ["Id", "Code", "Name"],
          },
        ],
      }
    );
    return assetTypeNotification; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 AssetTypeNotification
  static async updateAssetTypeNotification(id, data) {
    //console.log('UpdateAssetTypeNotification - data:', data);
    const assetTypeNotification = await AssetTypeNotificationModel.findByPk(id);
    if (!assetTypeNotification) {
      return null;
    }

    await assetTypeNotification.update(data);
    return assetTypeNotification;
  }

  // Xóa 1 AssetTypeNotification
  static async deleteAssetTypeNotification(id) {
    const assetTypeNotification = await AssetTypeNotificationModel.findByPk(id);

    const foundAsset = await AssetModel.count({
      where: { AssetNotificationId: id },
    });
    if (foundAsset > 0)
      throw new ErrorResponse(
        "AssetTypeNotification đã tồn tại trong Asset. Không thể xóa!"
      );

    if (!assetTypeNotification) {
      return null;
    }

    await assetTypeNotification.destroy();
    return true;
  }
}

module.exports = AssetTypeNotificationService;
