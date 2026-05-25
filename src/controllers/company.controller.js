const companyService = require("../services/company.service");
const { SuccessResponse } = require("../core/success.response");

class CompanyController {
  createCompany = async (req, res, next) => {
    try {
      //const inputData = req.body;
      // console.log('CreateCompany - HEADERS:', req.headers);
      // console.log('CreateCompany - RAW_BODY:', req.rawBody);
      // console.log('CreateCompany - BODY:', inputData);
      new SuccessResponse({
        message: "Company created successfully",
        metadata: await companyService.createCompany(req.body),
      }).send(res);
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  };

  getAllCompanies = async (req, res, next) => {
    const { page, limit } = req.query;
    new SuccessResponse({
      message: "Companies retrieved successfully",
      metadata: await companyService.getAllCompanies({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    }).send(res);
  };

  getCompanyById = async (req, res, next) => {
    const { Id } = req.params;
    //const idKey = Object.keys(req.params).find((k) => k.toLowerCase() === 'id');
    //const id = idKey ? req.params[idKey] : undefined;
    const company = await companyService.getCompanyById(Id);
    new SuccessResponse({
      message: "Company retrieved successfully",
      metadata: company,
    }).send(res);
  };

  updateCompany = async (req, res, next) => {
    const { Id } = req.params;
    const updatedCompany = await companyService.updateCompany(Id, req.body);
    new SuccessResponse({
      message: "Company updated successfully",
      metadata: updatedCompany,
    }).send(res);
  };

  deleteCompany = async (req, res, next) => {
    try {
      const { Id } = req.params;
      await companyService.deleteCompany(Id);
      new SuccessResponse({
        message: "Company deleted successfully",
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

module.exports = new CompanyController();
