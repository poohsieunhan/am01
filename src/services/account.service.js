const { Account: AccountModel, Asset: AssetModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");

class AccountService {
  // Tạo mới 1 Account
  static async createAccount(data) {
    const _name = data.Name;
    const existingAccount = await AccountModel.findOne({
      where: { Name: _name },
    });
    if (existingAccount) {
      throw new ErrorResponse("Account with this Name already exists.");
    }

    const account = await AccountModel.create(data);
    return account;
  }

  // Lấy danh sách Account
  static async getAllAccounts({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await AccountModel.findAndCountAll({
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
  static async getAccountById(id) {
    const account = await AccountModel.findByPk(id);
    return account; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 Account
  static async updateAccount(id, data) {
    //console.log('UpdateAccount - data:', data);
    const account = await AccountModel.findByPk(id);
    if (!account) {
      return null;
    }

    await account.update(data);
    return account;
  }

  // Xóa 1 Account
  static async deleteAccount(id) {
    const account = await AccountModel.findByPk(id);

    const foundAccount = await AssetModel.count({
      where: { AccountId: id },
    });
    if (foundAccount > 0)
      throw new ErrorResponse("Account đã tồn tại trong Asset. Không thể xóa!");

    if (!account) {
      return null;
    }

    await account.destroy();
    return true;
  }
}

module.exports = AccountService;
