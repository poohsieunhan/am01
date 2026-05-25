const accountService = require("../services/account.service");
const { SuccessResponse } = require("../core/success.response");

class AccountController {
  createAccount = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateAccount - HEADERS:', req.headers);
      // console.log('CreateAccount - RAW_BODY:', req.rawBody);
      // console.log('CreateAccount - BODY:', inputData);
      new SuccessResponse({
        message: "Account created successfully",
        metadata: await accountService.createAccount(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllAccounts = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Accounts retrieved successfully",
      metadata: await accountService.getAllAccounts({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    }).send(res);
  };

  getAccountById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const account = await accountService.getAccountById(Id);
    new SuccessResponse({
      message: "Account retrieved successfully",
      metadata: account,
    }).send(res);
  };

  updateAccount = async (req, res, next) => {
    const { Id } = req.params;
    const updatedAccount = await accountService.updateAccount(Id, req.body);
    new SuccessResponse({
      message: "Account updated successfully",
      metadata: updatedAccount,
    }).send(res);
  };

  deleteAccount = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await accountService.deleteAccount(Id);
      new SuccessResponse({
        message: "Account deleted successfully",
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

module.exports = new AccountController();
