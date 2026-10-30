const userService = require("../services/user.service");
const { SuccessResponse } = require("../core/success.response");

class UserController {
  login = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Login successful",
        metadata: await userService.login(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 400;
      res.status(status).json({
        status: "error",
        message: error.message || "Đăng nhập thất bại",
      });
    }
  };

  createUser = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "User created successfully",
        metadata: await userService.createUser(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllUsers = async (req, res, next) => {
    const { page, limit, search } = req.query;
    new SuccessResponse({
      message: "Users retrieved successfully",
      metadata: await userService.getAllUsers({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
      }),
    }).send(res);
  };

  getUserById = async (req, res, next) => {
    const { Id } = req.params;
    const user = await userService.getUserById(Id);
    new SuccessResponse({
      message: "User retrieved successfully",
      metadata: user,
    }).send(res);
  };

  updateUser = async (req, res, next) => {
    const { Id } = req.params;
    const updatedUser = await userService.updateUser(Id, req.body);
    new SuccessResponse({
      message: "User updated successfully",
      metadata: updatedUser,
    }).send(res);
  };

  deleteUser = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await userService.deleteUser(Id);
      new SuccessResponse({
        message: "User deleted successfully",
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };
}

module.exports = new UserController();
