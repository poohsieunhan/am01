const emailRecipientService = require("../services/emailrecipient.service");
const { SuccessResponse } = require("../core/success.response");

class EmailRecipientController {
  createEmailRecipient = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateEmailRecipient - HEADERS:', req.headers);
      // console.log('CreateEmailRecipient - RAW_BODY:', req.rawBody);
      // console.log('CreateEmailRecipient - BODY:', inputData);
      new SuccessResponse({
        message: "EmailRecipient created successfully",
        metadata: await emailRecipientService.createEmailRecipient(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllEmailRecipients = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "EmailRecipients retrieved successfully",
      metadata: await emailRecipientService.getAllEmailRecipients({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    }).send(res);
  };

  getEmailRecipientById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const emailRecipient =
      await emailRecipientService.getEmailRecipientById(Id);
    new SuccessResponse({
      message: "EmailRecipient retrieved successfully",
      metadata: emailRecipient,
    }).send(res);
  };

  updateEmailRecipient = async (req, res, next) => {
    const { Id } = req.params;
    const updatedEmailRecipient =
      await emailRecipientService.updateEmailRecipient(Id, req.body);
    new SuccessResponse({
      message: "EmailRecipient updated successfully",
      metadata: updatedEmailRecipient,
    }).send(res);
  };

  deleteEmailRecipient = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await emailRecipientService.deleteEmailRecipient(Id);
      new SuccessResponse({
        message: "EmailRecipient deleted successfully",
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

module.exports = new EmailRecipientController();
