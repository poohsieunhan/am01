const { AssetType: AssetTypeModel, Asset: AssetModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AssetTypeService {
  // Tạo mới 1 AssetType
  static async createAssetType(data) {
    const _name = data.Name;
    const existingAssetType = await AssetTypeModel.findOne({
      where: { Name: _name },
    });
    if (existingAssetType) {
      throw new ErrorResponse("AssetType with this Name already exists.");
    }

    const assetType = await AssetTypeModel.create(data);
    return assetType;
  }

  // Lấy danh sách AssetType
  static async getAllAssetTypes({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await AssetTypeModel.findAndCountAll({
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

  // Lấy detail 1 AssetType theo Id
  static async getAssetTypeById(id) {
    const assetType = await AssetTypeModel.findByPk(id);
    return assetType; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 AssetType
  static async updateAssetType(id, data) {
    //console.log('UpdateAssetType - data:', data);
    const assetType = await AssetTypeModel.findByPk(id);
    if (!assetType) {
      return null;
    }

    await assetType.update(data);
    return assetType;
  }

  // Xóa 1 AssetType
  static async deleteAssetType(id) {
    const assetType = await AssetTypeModel.findByPk(id);

    const foundAssetType = await AssetModel.count({
      where: { AssetTypeId: id },
    });
    if (foundAssetType > 0)
      throw new ErrorResponse(
        "AssetType đã tồn tại trong Asset. Không thể xóa!"
      );

    if (!assetType) {
      return null;
    }

    await assetType.destroy();
    return true;
  }
}

module.exports = AssetTypeService;
