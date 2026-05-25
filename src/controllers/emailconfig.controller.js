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
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "EmailConfigs retrieved successfully",
      metadata: await emailConfigService.getAllEmailConfigs({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    }).send(res);
  };

  getEmailConfigById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const emailConfig =
      await emailConfigService.getEmailConfigById(Id);
    new SuccessResponse({
      message: "EmailConfig retrieved successfully",
      metadata: emailConfig,
    }).send(res);
  };

  updateEmailConfig = async (req, res, next) => {
    const { Id } = req.params;
    const updatedEmailConfig =
      await emailConfigService.updateEmailConfig(Id, req.body);
    new SuccessResponse({
      message: "EmailConfig updated successfully",
      metadata: updatedEmailConfig,
    }).send(res);
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
