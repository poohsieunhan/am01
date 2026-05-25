const { EmailConfig: EmailConfigModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class EmailConfigService {
  // Tạo mới 1 EmailConfig
  static async createEmailConfig(data) {
    const _email = data.Username;
    const existingEmailConfig = await EmailConfigModel.findOne({
      where: { Username: _email },
    });
    if (existingEmailConfig) {
      throw new ErrorResponse("EmailConfig with this Username already exists.");
    }

    const emailConfig = await EmailConfigModel.create(data);
    return emailConfig;
  }

  // Lấy danh sách EmailConfig
  static async getAllEmailConfigs({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await EmailConfigModel.findAndCountAll({
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

  // Lấy detail 1 EmailConfig theo Id
  static async getEmailConfigById(id) {
    const emailConfig = await EmailConfigModel.findByPk(id);
    return emailConfig; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 EmailConfig
  static async updateEmailConfig(id, data) {
    //console.log('UpdateEmailConfig - data:', data);
    const emailConfig = await EmailConfigModel.findByPk(id);
    if (!emailConfig) {
      return null;
    }

    await emailConfig.update(data);
    return emailConfig;
  }

  // Xóa 1 EmailConfig
  static async deleteEmailConfig(id) {
    const emailConfig = await EmailConfigModel.findByPk(id);

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

module.exports = EmailConfigService;
