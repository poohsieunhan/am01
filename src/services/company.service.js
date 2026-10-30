const { Company: CompanyModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");
const { Op } = require("sequelize");

class CompanyService {
  // Tạo mới 1 Company
  static async createCompany(data) {
    const maSoThue = data.MaSoThue;
    const existingCompany = await CompanyModel.findOne({
      where: { MaSoThue: maSoThue },
    });
    if (existingCompany) {
      throw new ErrorResponse("Company with this MaSoThue already exists.");
    }

    const company = await CompanyModel.create(data);
    return company;
  }

  // Lấy danh sách Company
  static async getAllCompanies({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;

    const where = {};
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { TenCongTy: { [Op.like]: q } },
        { MaSoThue: { [Op.like]: q } },
        { DiaChi: { [Op.like]: q } },
        { SoDienThoai: { [Op.like]: q } },
        { Email: { [Op.like]: q } },
      ];
    }

    const { rows, count } = await CompanyModel.findAndCountAll({
      where,
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

  // Lấy detail 1 Company theo Id
  static async getCompanyById(id) {
    const company = await CompanyModel.findByPk(id);
    return company; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 Company
  static async updateCompany(id, data) {
    //console.log('UpdateCompany - data:', data);
    const company = await CompanyModel.findByPk(id);
    if (!company) {
      return null;
    }

    await company.update(data);
    return company;
  }

  // Xóa 1 Company
  static async deleteCompany(id) {
    const company = await CompanyModel.findByPk(id);

    const foundCompany = await RequestFormModel.count({
      where: { CongtyId: id },
    });
    if (foundCompany > 0)
      throw new ErrorResponse(
        "Công ty đã tồn tại trong Phiếu yêu cầu. Không thể xóa!"
      );

    if (!company) {
      return null;
    }

    await company.destroy();
    return true;
  }
}

module.exports = CompanyService;
