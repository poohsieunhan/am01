const { EmailRecipient: EmailRecipientModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");
const { Op } = require("sequelize");

class EmailRecipientService {
  // Tạo mới 1 EmailRecipient
  static async createEmailRecipient(data) {
    const _email = data.Email;
    const existingEmailRecipient = await EmailRecipientModel.findOne({
      where: { Email: _email },
    });
    if (existingEmailRecipient) {
      throw new ErrorResponse("EmailRecipient with this Email already exists.");
    }

    const emailRecipient = await EmailRecipientModel.create(data);
    return emailRecipient;
  }

  // Lấy danh sách EmailRecipient
  static async getAllEmailRecipients({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;

    const where = {};
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { Email: { [Op.like]: q } },
      ];
    }

    const { rows, count } = await EmailRecipientModel.findAndCountAll({
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

  // Lấy detail 1 EmailRecipient theo Id
  static async getEmailRecipientById(id) {
    const emailRecipient = await EmailRecipientModel.findByPk(id);
    return emailRecipient; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 EmailRecipient
  static async updateEmailRecipient(id, data) {
    //console.log('UpdateEmailRecipient - data:', data);
    const emailRecipient = await EmailRecipientModel.findByPk(id);
    if (!emailRecipient) {
      return null;
    }

    await emailRecipient.update(data);
    return emailRecipient;
  }

  // Xóa 1 EmailRecipient
  static async deleteEmailRecipient(id) {
    const emailRecipient = await EmailRecipientModel.findByPk(id);

    const foundAsset = await AssetModel.count({
      where: { EmailRecipientId: id },
    });
    if (foundAsset > 0)
      throw new ErrorResponse(
        "EmailRecipient đã tồn tại trong Asset. Không thể xóa!"
      );

    if (!emailRecipient) {
      return null;
    }

    await emailRecipient.destroy();
    return true;
  }
}

module.exports = EmailRecipientService;
