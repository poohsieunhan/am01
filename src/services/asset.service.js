const { Account: AccountModel, Asset: AssetModel, Company: CompanyModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AssetService {
  // Tạo mới 1 Asset
  static async createAsset(data) {
    const _name = data.Name;
    const existingAsset = await AssetModel.findOne({
      where: { Name: _name },
    });
    if (existingAsset) {
      throw new ErrorResponse("Asset with this Name already exists.");
    }

    const asset = await AssetModel.create(data);
    return asset;
  }

  // Lấy danh sách Asset
  static async getAllAssets({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await AssetModel.findAndCountAll({
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

  // Lấy detail 1 Asset theo Id
  static async getAssetById(id) {
    const asset = await AssetModel.findByPk(id);
    return asset; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 Asset
  static async updateAsset(id, data) {
    //console.log('UpdateAsset - data:', data);
    const asset = await AssetModel.findByPk(id);
    if (!asset) {
      return null;
    }

    await asset.update(data);
    return asset;
  }

  // Xóa 1 Asset
  static async deleteAsset(id) {
    const asset = await AssetModel.findByPk(id);

    const foundAccount = await AssetModel.count({
      where: { AccountId: id },
    });
    if (foundAccount > 0)
      throw new ErrorResponse("Asset đã tồn tại trong Account. Không thể xóa!");

    if (!asset) {
      return null;
    }

    await asset.destroy();
    return true;
  }
}

module.exports = AssetService;
