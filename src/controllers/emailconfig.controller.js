const emailConfigService = require("../services/emailconfig.service");
const { SuccessResponse } = require("../core/success.response");

class EmailConfigController {
  createEmailConfig = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateEmailConfig - HEADERS:', req.headers);
      // console.log('CreateEmailConfig - RAW_BODY:', req.rawBody);
      // console.log('CreateEmailConfig - BODY:', inputData);
      new SuccessResponse({
        message: "EmailConfig created successfully",
        metadata: await emailConfigService.createEmailConfig(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllEmailConfigs = async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;
      new SuccessResponse({
        message: "EmailConfigs retrieved successfully",
        metadata: await emailConfigService.getAllEmailConfigs({
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          search: search || "",
        }),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getEmailConfigById = async (req, res, next) => {
    try {
      const { Id } = req.params;
      const emailConfig =
        await emailConfigService.getEmailConfigById(Id);
      new SuccessResponse({
        message: "EmailConfig retrieved successfully",
        metadata: emailConfig,
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  updateEmailConfig = async (req, res, next) => {
    try {
      const { Id } = req.params;
      const updatedEmailConfig =
        await emailConfigService.updateEmailConfig(Id, req.body);
      new SuccessResponse({
        message: "EmailConfig updated successfully",
        metadata: updatedEmailConfig,
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  deleteEmailConfig = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await emailConfigService.deleteEmailConfig(Id);
      new SuccessResponse({
        message: "EmailConfig deleted successfully",
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

module.exports = new EmailConfigController();
