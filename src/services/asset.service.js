const { Op } = require("sequelize");
const {
  Account: AccountModel,
  Asset: AssetModel,
  AssetType: AssetTypeModel,
  Company: CompanyModel,
  Project: ProjectModel,
} = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AssetService {
  // Lấy thống kê và danh sách tài sản sắp hết hạn
  static async getExpiringAssets({ days = 30, page = 1, limit = 50, type = "expiring" } = {}) {
    const numDays = parseInt(days, 10) || 30;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const targetEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + numDays, 23, 59, 59, 999);

    // 1. Tổng số tài sản
    const totalAssets = await AssetModel.count();

    // 2. Số tài sản đã hết hạn
    const expiredCount = await AssetModel.count({
      where: {
        ExpireDate: {
          [Op.lt]: todayStart,
        },
      },
    });

    // 3. Số tài sản sắp hết hạn trong X ngày
    const expiringCount = await AssetModel.count({
      where: {
        ExpireDate: {
          [Op.between]: [todayStart, targetEnd],
        },
      },
    });

    // Điều kiện lọc theo type
    let whereCondition = {};
    if (type === "expired") {
      whereCondition = {
        ExpireDate: {
          [Op.lt]: todayStart,
        },
      };
    } else if (type === "all_warning") {
      whereCondition = {
        ExpireDate: {
          [Op.lte]: targetEnd,
        },
      };
    } else {
      whereCondition = {
        ExpireDate: {
          [Op.between]: [todayStart, targetEnd],
        },
      };
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await AssetModel.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [["ExpireDate", "ASC"]],
      include: [
        {
          model: AssetTypeModel,
          as: "assetTypeId",
          attributes: ["Id", "Code", "Name"],
        },
        {
          model: CompanyModel,
          as: "company",
          attributes: ["Id", "TenCongTy", "MaSoThue"],
        },
        {
          model: AccountModel,
          as: "account",
          attributes: ["Id", "Name", "Username"],
        },
        {
          model: ProjectModel,
          as: "project",
          attributes: ["Id", "Name", "Address"],
        },
      ],
      distinct: true,
    });

    return {
      summary: {
        totalAssets,
        expiredCount,
        expiringCount,
        days: numDays,
      },
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  // Tạo mới 1 Asset
  static async createAsset(data) {
    const _name = data.Name;
    const _assetTypeId = data.AssetTypeId;
    const existingAsset = await AssetModel.findOne({
      where: {
        Name: _name,
        AssetTypeId: _assetTypeId
      },
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
      include: [
        {
          model: AssetTypeModel,
          as: "assetTypeId",
          attributes: ["Id", "Code", "Name"],
        },
        {
          model: CompanyModel,
          as: "company",
          attributes: ["Id", "TenCongTy", "MaSoThue"],
        },
        {
          model: AccountModel,
          as: "account",
          attributes: ["Id", "Name", "Username"],
        },
        {
          model: ProjectModel,
          as: "project",
          attributes: ["Id", "Name", "Address"],
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

  // Lấy detail 1 Asset theo Id
  static async getAssetById(id) {
    const asset = await AssetModel.findByPk(id, {
      include: [
        {
          model: AssetTypeModel,
          as: "assetTypeId",
          attributes: ["Id", "Code", "Name"],
        },
        {
          model: CompanyModel,
          as: "company",
          attributes: ["Id", "TenCongTy", "MaSoThue"],
        },
        {
          model: AccountModel,
          as: "account",
          attributes: ["Id", "Name", "Username"],
        },
        {
          model: ProjectModel,
          as: "project",
          attributes: ["Id", "Name", "Address"],
        },
      ],
    });
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
