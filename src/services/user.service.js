const { User: UserModel } = require("../models");
const { ErrorResponse, BadRequestError } = require("../core/error.response");
const { Op } = require("sequelize");

class UserService {
  // Đăng nhập
  static async login({ LoginName, Password }) {
    if (!LoginName || !Password) {
      throw new BadRequestError("Vui lòng nhập tên đăng nhập và mật khẩu.");
    }

    const user = await UserModel.findOne({
      where: {
        LoginName: LoginName.trim(),
        Password: Password.trim(),
      },
      attributes: ["Id", "LoginName", "Role"],
    });

    if (!user) {
      throw new BadRequestError("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }

    return user;
  }

  // Tạo mới 1 User
  static async createUser(data) {
    const { LoginName, Password, Role } = data;
    if (!LoginName) {
      throw new BadRequestError("Tên đăng nhập (LoginName) là bắt buộc.");
    }

    const existingUser = await UserModel.findOne({
      where: { LoginName: LoginName.trim() },
    });
    if (existingUser) {
      throw new ErrorResponse("Người dùng với tên đăng nhập này đã tồn tại.");
    }

    const user = await UserModel.create({
      LoginName: LoginName.trim(),
      Password: Password ? Password.trim() : "",
      Role: Number(Role) || 1,
    });
    return user;
  }

  // Lấy danh sách User
  static async getAllUsers({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;

    const where = {};
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { LoginName: { [Op.like]: q } },
      ];
    }

    const { rows, count } = await UserModel.findAndCountAll({
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

  // Lấy detail 1 User theo Id
  static async getUserById(id) {
    const user = await UserModel.findByPk(id);
    return user; // có thể null nếu không tìm thấy
  }

  // Cập nhật 1 User
  static async updateUser(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return null;
    }

    if (data.LoginName) {
      const existingUser = await UserModel.findOne({
        where: {
          Id: { [Op.ne]: id },
          LoginName: data.LoginName.trim(),
        },
      });
      if (existingUser) {
        throw new ErrorResponse("Người dùng với tên đăng nhập này đã tồn tại.");
      }
      user.LoginName = data.LoginName.trim();
    }

    if (data.Password && data.Password.trim()) {
      user.Password = data.Password.trim();
    }

    if (data.Role !== undefined && data.Role !== null) {
      user.Role = Number(data.Role);
    }

    await user.save();
    return user;
  }

  // Xóa 1 User
  static async deleteUser(id) {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return null;
    }

    await user.destroy();
    return true;
  }
}

module.exports = UserService;
